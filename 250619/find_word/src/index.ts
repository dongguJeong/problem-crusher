import { ChildProcess } from "child_process";
import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

const data = fs.readFileSync(path.join(__dirname, "../input/1m.csv"));
const words = data
  .toString()
  .split("\n")
  .map((line) => line.trim());

const queryFile = fs.readFileSync(path.join(__dirname, "../input/queries.csv"));
const queries = queryFile
  .toString()
  .split("\n")
  .map((line) => line.trim());

words.shift();
queries.shift();

class Node {
  end: Boolean;
  count: number;
  prefix: string;
  children: { [key: string]: Node };

  constructor() {
    this.end = false;
    this.count = 0;
    this.prefix = "";
    this.children = {};
  }
}

class Trie {
  root: Node;

  constructor() {
    this.root = new Node();
  }

  insert(word: string) {
    let curNode = this.root;
    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      if (!curNode.children[c]) {
        curNode.children[c] = new Node();
        curNode.children[c].count = 1;
        curNode.children[c].prefix = curNode.prefix + c;
      } else {
        curNode.children[c].count += 1;
      }
      curNode = curNode.children[c];
    }
    curNode.end = true;
  }

  findTop10(prefix: string) {
    const result: Node[] = [];

    // 1.단 prefix를 찾아
    let curNode = this.root;
    for (let i = 0; i < prefix.length; i++) {
      if (curNode.children[prefix[i]]) {
        curNode = curNode.children[prefix[i]];
      }
    }

    if (!curNode) return [];

    // 2. BFS로 prefix의 자식들을 싹 다 뒤진다
    const q: Node[] = [];
    const res: Node[] = [];
    q.push(curNode);
    res.push(curNode);
    while (q.length > 0) {
      const now = q.pop()!;

      for (const value of Object.values(now.children)) {
        if (res.length <= 10) {
          res.push(value);
          res.sort((a, b) => b.count - a.count);
        } else {
          if (res[0].count <= value.count) {
            res.sort((a, b) => {
              if (a.count === b.count) {
                return a.prefix.localeCompare(b.prefix);
              }
              return b.count - a.count;
            });
            res.shift();
          }
        }
      }
    }
    return res;
  }
}

const trie = new Trie();
words.forEach((word) => {
  trie.insert(word);
});

function findWord(prefix: string): {
  duration: number;
  result: string[];
} {
  const startTime = performance.now();
  const result: string[] = [];

  const res = trie.findTop10(prefix);

  res.forEach((v) => {
    result.push(v.prefix);
  });

  const duration = performance.now() - startTime;

  return {
    duration,
    result,
  };
}

queries.map((query) => {
  console.log(findWord(query));
});
