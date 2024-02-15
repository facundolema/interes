<script lang="ts">
	import { onMount } from 'svelte';
	import { readCSV } from '$lib/functions';
	import Papa from 'papaparse';

	let data: Array<{ FECHA: string; [key: string]: string }> = [];
	let endDate: string = '';
	let downloadLink: string = '';
	let csvFile: File;
	let fileInput: HTMLInputElement;
	let downloadAnchor: HTMLAnchorElement;
	let fileName: string;

	onMount(async () => {
		try {
			data = await readCSV();
		} catch (error) {
			console.error(error);
		}
	});

	function handleFileChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (target.files.length > 0) {
			fileName = target.files[0].name;
		}
	}

	function getCoefficient(from: string): number {
		const entry = data.find((o) => o.FECHA === from);
		return entry ? Number(entry[formatDate(endDate)]) : 0;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	function calculateAndUpdateRow(): void {
		csvFile = fileInput.files[0];
		if (!csvFile) return;

		const reader = new FileReader();
		reader.onload = (event) => parseCSV(event.target.result);
		reader.readAsText(csvFile);
	}

	function parseCSV(csvData: string): void {
		Papa.parse(csvData, {
			header: true,
			complete: (results) => {
				const nonEmptyRows = results.data.filter(
					(row: { [key: string]: string }) => row['desde'] && row['monto']
				);
				createDownloadLink(nonEmptyRows);
			}
		});
	}

	function createDownloadLink(rows: Array<{ [key: string]: string }>): void {
		const modifiedData = rows.map((row) => modifyRow(row));
		const csv = Papa.unparse(modifiedData);
		const blob = new Blob([csv], { type: 'text/csv' });
		downloadLink = URL.createObjectURL(blob);
	}

	function modifyRow(row: { [key: string]: string }): { [key: string]: string | number } {
		let [d, m, y] = row['desde'].split('/');
		let coefficient = getCoefficient(`${y}${m}${d}`);
		row['coeficiente'] = coefficient;
		row['monto actualizado'] = Math.round(parseInt(row['monto']) * coefficient * 100) / 100;
		return row;
	}

	function downloadFile(): void {
		downloadAnchor.href = downloadLink;
		downloadAnchor.download = fileName.split('.').slice(0, -1).join('.') + '_actualizado.csv';
		downloadAnchor.click();
	}
</script>

<main>
	<h1>Calculadora de Interes</h1>

	<div class="container">
		<label for="csv-file">Archivo (.csv)</label>
		<input type="file" accept=".csv" id="csv-file" bind:this={fileInput} on:change={handleFileChange} />
	</div>

	<div class="container">
		<label for="end-date">Hasta</label>
		<input type="date" id="end-date" min="2024-01-01" max="2024-01-31" bind:value={endDate} />
	</div>

	{#if downloadLink}
		<button on:click={downloadFile}> Descargar archivo actualizado </button>
	{:else}
		<button on:click={calculateAndUpdateRow}>Calcular interés</button>
	{/if}

	<a bind:this={downloadAnchor} style="display: none;"></a>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	input {
		margin-bottom: 10px;
		padding: 2px;
		width: 12rem;
		min-width: fit-content;
	}
	label {
		text-transform: uppercase;
		font-weight: bold;
		font-size: smaller;
		color: #444444;
	}
	button {
		width: 12.5rem;
		padding: 5px;
		margin-bottom: 10px;
	}
</style>
