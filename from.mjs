'use strict';
import { readFileSync, writeFileSync } from 'node:fs';

const inputFile = process.argv[2];
const inputData = readFileSync(inputFile).toString();
let zeros = 0;
for (let i = 0; i < inputData.length; i++)
{
	if (inputData[i] !== '0') break;
	zeros++;
}
let data = BigInt(inputData);
const byteSizeMax = zeros + Math.ceil((inputData.length - zeros) / Math.log10(256));
let outputData = new Uint8Array(byteSizeMax);
for (let i = 0; i < zeros; i++)
{
	outputData[i] = 0;
}
let i = byteSizeMax - 1;
while (data > 0n)
{
	const prevData = data;
	data >>= 8n;
	const mod = prevData - (data << 8n);
	outputData[i] = Number(mod);
	i--;
}
//byteSizeMax на 1 байт больше необходимого:
if (i + 1 !== zeros)
{
	outputData[i] = 0;
	outputData = new Uint8Array(outputData.buffer, 1);
}

writeFileSync(inputFile + '.bin', outputData);

