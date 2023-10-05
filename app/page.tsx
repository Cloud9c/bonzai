"use client";
import ReactForceGraph2d, {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import { COLORS } from "./constants";
import { useRef, FormEvent, useState, forwardRef, useEffect } from "react";
import { Nav } from "../components/nav";
import { useWindowSize } from "@react-hook/window-size";
import dynamic from "next/dynamic";
import { SearchResponse } from "metaphor-node";
import { searchMetaphor } from "./services/search";
import { findSimilar } from "./services/findSimilar";

const NoSSRForceGraph = dynamic(() => import("./ForceGraph2D"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState({
    nodes: [] as any,
    links: [] as any,
  });
  const [focused, setFocused] = useState<NodeObject | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [width, height] = useWindowSize();

  useEffect(() => {
    document.addEventListener("keydown", function (event: KeyboardEvent) {
      // Checking for Backspace.
      if (event.key === "Backspace" || event.key === "Delete") {
        if (focused) {
          prune(focused);
        }
      }
    });
  });

  async function focus(node: NodeObject | undefined = undefined) {
    if (node !== undefined) {
      setFocused(node);
    } else {
      setFocused(undefined);
    }
  }

  async function onSearchSubmit(event: FormEvent) {
    event.preventDefault();

    if (!loading) {
      let query = "";
      if (!focused) {
        const searchbar = document.getElementById(
          "searchbar"
        ) as HTMLInputElement;
        query = searchbar.value as string;
        if (query === "") return;
      }
      await search(query);
    }
  }

  async function search(query: string) {
    const numResults = 3;

    setLoading(true);

    const response: SearchResponse = focused
      ? await findSimilar(focused.url, numResults)
      : await searchMetaphor(query, numResults);

    setLoading(false);

    response.results.forEach((result) => {
      setData(({ nodes, links }) => {
        const id = crypto.randomUUID();
        const data: any = {
          nodes: [
            ...nodes,
            {
              id,
              title: result.title,
              url: result.url,
              documentId: result.id,
              domain: new URL(result.url).hostname,
              publishedDate: result.publishedDate,
              author: result.author,
            },
          ],
          links: focused ? [...links, { source: id, target: focused.id }] : [],
        };
        return data;
      });
    });
  }

  function onNodeClick(node: NodeObject, event: MouseEvent) {
    if (event.shiftKey) {
      window.open(node.url);
    } else {
      focus(node);
    }
  }

  function prune(node: NodeObject) {
    if (focused?.id === node.id) focus();

    setData(({ nodes, links }) => {
      const newNodes = nodes.filter((n: NodeObject) => n.id !== node.id);
      const newLinks = links.filter((l: LinkObject) => {
        const source = l.source as LinkObject;
        const target = l.target as LinkObject;
        return source.id !== node.id && target.id !== node.id;
      });
      return {
        nodes: newNodes,
        links: newLinks,
      };
    });
  }

  function nodeCanvasObject(
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    // // Draw circle
    ctx.beginPath();
    ctx.arc(
      node.x as number,
      node.y as number,
      10 / globalScale,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = focused?.id === node.id ? COLORS.green : COLORS.black;
    ctx.fill();

    // Draw text title
    const title = node.title as string;
    const fontSize = 12 / globalScale;
    const padding = 20;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.black;
    ctx.fillText(
      title,
      node.x as number,
      (node.y as number) + padding / globalScale
    );
  }

  return (
    <main className="min-h-screen black">
      <Nav
        onSearchSubmit={onSearchSubmit}
        focused={focused}
        loading={loading}
      />
      <NoSSRForceGraph
        graphData={data}
        width={width}
        height={height}
        nodeLabel="url"
        nodeColor={COLORS.white}
        backgroundColor={COLORS.white}
        minZoom={1}
        onNodeClick={onNodeClick}
        enablePointerInteraction={true}
        onBackgroundClick={() => focus()}
        nodeCanvasObject={nodeCanvasObject}
        onLinkClick={prune}
      />
    </main>
  );
}
