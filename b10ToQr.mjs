'use strict';
import QRCode from 'qrcode';

const MAX_SIZE = 7089;

let qrsInRow = Number(process.argv[2]);
if (!qrsInRow) qrsInRow = 1;

const inputData = (await readStream(process.stdin)).toString();

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<title>QR for print</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
~!~</body>
<style>
svg
{
	max-height: 100vh;
	max-width: calc(100% / ${qrsInRow});
}
div
{
	display: flex;
}
</style>
</html>
`.split('~!~');

const parts = Math.ceil(inputData.length / MAX_SIZE);
let index = 0;
const qrCodes = [];
qrCodes.push('\t<div>\n');
for (let i = 0; i < parts; i++)
{
	const nextIndex = index + MAX_SIZE;
	const digits = inputData.slice(index, nextIndex);
	index = nextIndex;
	if (i > 0 && i % qrsInRow === 0)
	{
		qrCodes.push('\t</div>\n');
		qrCodes.push('\t<div>\n');
	}
	const qr = await generateQR(digits);
	qrCodes.push('\t\t' + qr);
}
qrCodes.push('\t</div>\n');

process.stdout.write(html[0] + qrCodes.join('') + html[1]);

async function generateQR(text)
{
	var data = [{ data: text, mode: 'numeric' }]
	try
	{
		return await QRCode.toString(text, { type: 'svg', margin: 1, scale: 1, errorCorrectionLevel: 'L' });
	}
	catch (err)
	{
		console.error(err);
		return null;
	}
}

async function readStream(stream)
{
	return await new Promise((resolve, reject) =>
	{
		const data = [];
		stream.on('data', chunk =>
		{
			data.push(chunk);
		});
		stream.on('error', err =>
		{
			reject('Data reading error: ' + err);
			process.exit(1);
		});
		stream.on('end', () =>
		{
			resolve(Buffer.concat(data));
		});
	});
}
