"use strict";

const fs = require('fs');

class Programm {
  constructor() {
    this.fileName = (process.argv)[2];
    this.lookupTree = {};
    this.result = [];
    this.visited = [];
    this.readFile();
  }

  readFile() {
    if (!this.fileName) { throw Error('please add a filename program argument'); }
    const splitFile = fs.readFileSync(this.fileName, 'utf-8').split('\n');
    const firstLetters = splitFile.map(item => item.slice(0,1));
    this.dictionary = splitFile
      .filter(item => item !== '');
  }

  buildLookupTree() {
    for (let io = 0; io < this.dictionary.length; io++) {
      const word = this.dictionary[io];
      const lastCharacter = word.slice(-1);
      for (let ii = 0; ii < this.dictionary.length; ii++) {
        let childWord = this.dictionary[ii];
        if (lastCharacter === childWord.slice(0, 1) && word !== childWord) {
          (this.lookupTree[io] || (this.lookupTree[io] = [])).push(ii);
        }
      }
    }
    this.lookupTree[this.dictionary.length] = Array.from(this.dictionary.keys());
  }

  isVisited(index) {
    return this.visited[index];
  }

  visit(index) {
    this.visited[index] = true;
  }
  exit(index) {
    this.visited[index] = false;
  }
  find(currentIndex, rest, depth) {
    let list = this.lookupTree[currentIndex];
    if (!this.lookupTree[currentIndex]) {
      return rest;
    }
    for (let i = 0; i < list.length; i++) {
      let nextIndex = list[i];
      if (!this.isVisited(nextIndex)) {
        this.visit(nextIndex);
        rest[depth] = nextIndex;
        let candidate = this.find(nextIndex, rest, depth + 1);
        this.exit(nextIndex);
        if (depth + 1 > this.result.length) {
          this.result = candidate.slice(0, depth + 1);
        }
      }
    }
    return rest;
  }
  processFile() {
    this.buildLookupTree();
    this.find(this.dictionary.length, [], 0);
    console.log(this.result.map(i => this.dictionary[i]));
  }
}

const pokemonFinder = new Programm();
pokemonFinder.processFile();

