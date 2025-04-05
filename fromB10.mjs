'use strict';

readStream(process.stdin, buf =>
{
	const inputData = buf.toString();
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
	i++;
	if (i !== zeros)
	{
		outputData[i] = 0;
		outputData = new Uint8Array(outputData.buffer, 1);
	}
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

