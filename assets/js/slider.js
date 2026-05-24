/**
 * PUGLIA TURISMO — slider.js
 * 
 * Questo script gestisce la logica di scorrimento orizzontale (carosello/slider) 
 * Consente di navigare tra le card usando bottoni freccia su schermi desktop,
 * gestendo dinamicamente la visibilità delle frecce in base all'overflow e allo scorrimento.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Seleziona tutti i contenitori di card abilitati per lo scorrimento
  const sliders = document.querySelectorAll('.slider-track, .areas-grid--slider, .exp-grid--slider, .events-compact--slider');

  sliders.forEach(slider => {
    // DISPOSITIVI TOUCH / DISPOSITIVI COARSE:
    // Se l'utente utilizza uno schermo touch (es. smartphone o tablet), non viene aggiunto 
    // alcun pulsante. Lo scorrimento orizzontale nativo tramite tocco è più naturale ed efficiente.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // CREAZIONE DEL WRAPPER:
    // Crea un contenitore esterno (.slider-wrapper) per posizionare in modo assoluto i pulsanti delle frecce
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';

    // Inserisce il wrapper nel DOM subito prima del carosello originale e sposta il carosello al suo interno
    slider.parentNode.insertBefore(wrapper, slider);
    wrapper.appendChild(slider);

    // CREAZIONE DEL BOTTONE PRECEDENTE (Freccia Sinistra):
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-arrow slider-arrow--prev';
    prevBtn.innerHTML = '&#10094;'; // Carattere unicode per la freccia sinistra (❮)
    prevBtn.setAttribute('aria-label', 'Scorri a sinistra');

    // CREAZIONE DEL BOTTONE SUCCESSIVO (Freccia Destra):
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-arrow slider-arrow--next';
    nextBtn.innerHTML = '&#10095;'; // Carattere unicode per la freccia destra (❯)
    nextBtn.setAttribute('aria-label', 'Scorri a destra');

    // Aggiunge le frecce all'interno del wrapper
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);

    // QUANTITÀ DI SCORRIMENTO:
    // Definisce quanti pixel spostare ad ogni click. 
    // 320px corrisponde approssimativamente alla larghezza tipica di una card più lo spazio del gap (margin/gap).
    const scrollAmount = 320;

    // EVENTI DI CLICK SULLE FRECCE:
    // Scorre il contenitore in modo fluido (smooth behavior) verso sinistra o destra
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // FUNZIONE DI AGGIORNAMENTO DINAMICO DEI PULSANTI:
    // Mostra o nasconde le frecce in base alle dimensioni del contenitore e alla posizione di scorrimento.
    const updateButtons = () => {
      // Verifica se la larghezza totale del contenuto (scrollWidth) è superiore alla larghezza visibile (clientWidth).
      // Aggiungiamo un margine di tolleranza di 5 pixel per evitare falsi positivi.
      const hasOverflow = slider.scrollWidth > slider.clientWidth + 5;

      // Se non c'è overflow (tutte le card entrano perfettamente nello schermo), nasconde entrambe le frecce.
      if (!hasOverflow) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
        return;
      }

      // Se c'è overflow, gestisce le singole frecce in base alla posizione di scroll attuale:

      // Controllo per la freccia sinistra:
      // Se siamo vicini all'inizio dello scorrimento (scrollLeft <= 5px), nasconde la freccia sinistra.
      const atStart = slider.scrollLeft <= 5;
      prevBtn.style.opacity = atStart ? '0' : '1';
      prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';

      // Controllo per la freccia destra:
      // Se abbiamo raggiunto la fine dello scorrimento (scrollLeft >= larghezza_contenuto - larghezza_schermo - tolleranza), nasconde la freccia destra.
      const atEnd = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 5;
      nextBtn.style.opacity = atEnd ? '0' : '1';
      nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    // Ascolta l'evento di scroll sul contenitore per aggiornare la visibilità delle frecce in tempo reale
    slider.addEventListener('scroll', updateButtons);

    // RESIZE OBSERVER (Gestione del Responsive e dei Tab):
    // Il ResizeObserver monitora costantemente i cambiamenti di dimensione delle card e dei contenitori.
    // Questo è fondamentale per i tab (ad es. nella pagina esperienze), che sono inizialmente nascosti (display: none).
    // Quando un tab diventa visibile (display: block), le dimensioni del slider cambiano da 0 a quelle reali: 
    // il ResizeObserver rileva questo cambiamento e attiva updateButtons per posizionare e mostrare le frecce corrette.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateButtons();
      });
      ro.observe(slider);
    }

    // Esegue il primo controllo dopo 150ms per consentire al layout HTML/CSS di rendering iniziale
    setTimeout(updateButtons, 150);

    // Esegue il controllo in caso di ridimensionamento della finestra del browser
    window.addEventListener('resize', updateButtons);
  });
});
