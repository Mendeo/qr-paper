'use strict';

readStream(process.stdin, buf =>
{
	const inputData = new Uint8Array(buf);
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
	process.stdout.write(outputData);
});

function readStream(stream, callback)
{
	const data = [];
	stream.on('data', chunk =>
	{
		data.push(chunk);
	});
	stream.on('error', err =>
	{
		console.log('Data reading error: ' + err);
		process.exit(1);
	});
	stream.on('end', () =>
	{
		callback(Buffer.concat(data));
	});
}
