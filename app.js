// CONFIGURAZIONE (Sostituisci con i tuoi dati reali)
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const NEXTCLOUD_BASE_URL = 'https://nextcloud.lombardia.cisl.it'; // Senza slash finale
const SHARE_TOKEN = 'nr6SDkTNxDoKe4B'; // Il token generato nella Fase 1

const WEBDAV_URL = `${PROXY_URL}${NEXTCLOUD_BASE_URL}/public.php/webdav/`;

async function fetchPublicFiles() {
    const loadingEl = document.getElementById('loading');
    const gridEl = document.getElementById('files-grid');

    try {
        // Richiesta WebDAV (PROPFIND chiede la lista dei file)
        const response = await fetch(WEBDAV_URL, {
            method: 'PROPFIND',
            headers: {
                // Autenticazione Basic: Token come username, password vuota
                'Authorization': 'Basic ' + btoa(SHARE_TOKEN + ':'),
                'Depth': '1' // Chiede solo il primo livello di file
            }
        });

        if (!response.ok) throw new Error('Impossibile connettersi a Nextcloud');

        const xmlText = await response.text();
        
        // Parsiamo l'XML restituito da Nextcloud
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Gli elementi dei file in WebDAV si chiamano <d:response> o <href>
        const responses = xmlDoc.getElementsByTagNameNS("DAV:", "response");
        
        let filesHtml = '';
        
        // Saltiamo il primo elemento (indice 0) perché è la cartella principale stessa
        for (let i = 1; i < responses.length; i++) {
            const href = responses[i].getElementsByTagNameNS("DAV:", "href")[0].textContent;
            
            // Estraiamo il nome del file dall'URL codificato
            const encodedName = href.split('/').filter(Boolean).pop();
            const fileName = decodeURIComponent(encodedName);
            
            // Generiamo il link diretto per scaricare il file
            const fileDownloadUrl = `${NEXTCLOUD_BASE_URL}${href}`;

            // Creiamo la card per il file
            filesHtml += `
                <div class="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                        <div class="text-4xl mb-3">📄</div>
                        <h3 class="font-semibold text-gray-700 truncate" title="${fileName}">${fileName}</h3>
                    </div>
                    <div class="mt-4">
                        <a href="${fileDownloadUrl}" target="_blank" class="block text-center w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium py-2 rounded-lg text-sm transition">
                            Scarica / Vedi
                        </a>
                    </div>
                </div>
            `;
        }

        // Mostriamo i dati a schermo
        loadingEl.classList.add('hidden');
        gridEl.innerHTML = filesHtml;
        gridEl.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        loadingEl.innerText = "Errore durante il caricamento dei file. Controlla la configurazione o la console.";
        loadingEl.classList.add('text-red-500');
    }
}

// Avvia la funzione quando la pagina è pronta
document.getElementById('btn-public').addEventListener('click', (e) => {
    e.preventDefault();
    fetchPublicFiles();
});

// Carica i file in automatico all'avvio
fetchPublicFiles();
