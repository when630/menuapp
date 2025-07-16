import React, { useEffect, useState } from 'react';

// 타입 정의
export type TreeNode = {
  name: string;
  children?: TreeNode[];
};

export function buildTreeFromDepth(data: any[]): TreeNode[] {
  const rootMap = new Map<string, any>();

  for (const row of data) {
    const { depth1, depth2, depth3 } = row;
    if (!depth1) continue;

    if (!rootMap.has(depth1)) {
      rootMap.set(depth1, { name: depth1, children: new Map<string, any>() });
    }
    const depth1Node = rootMap.get(depth1);

    if (depth2) {
      if (!depth1Node.children.has(depth2)) {
        depth1Node.children.set(depth2, { name: depth2, children: new Map<string, any>() });
      }
      const depth2Node = depth1Node.children.get(depth2);

      if (depth3) {
        depth2Node.children.set(depth3, { name: depth3 });
      }
    }
  }

  const convertMapToArray = (map: Map<string, any>): TreeNode[] =>
    Array.from(map.values()).map((node: any) => ({
      name: node.name,
      children: node.children ? convertMapToArray(node.children) : undefined,
    }));

  return convertMapToArray(rootMap);
}