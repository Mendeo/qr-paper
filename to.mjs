'use strict';
import { readFileSync, writeFileSync } from 'node:fs';

const inputFile = process.argv[2];
const inputData = new Uint8Array(readFileSync(inputFile));
let outputData = 0n;
let m = 1n;
for (let i = inputData.length - 1; i >= 0; i--)
{
	outputData += BigInt(inputData[i]) * m;
	m <<= 8n;
}
let zeros = '';
for (let b of inputData)
{
	if (b > 0) break;
	zeros += '0';
}
outputData = zeros + outputData.toString();
writeFileSync(inputFile + '.b10', outputData);