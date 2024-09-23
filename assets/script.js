document.addEventListener('DOMContentLoaded', function () {
  const folderList = document.getElementById('folderList');
  const content = document.getElementById('content'); // Zmienna dla głównej zawartości
  const pdfViewer = document.getElementById('pdfViewer');
  const sidebar = document.querySelector('#chapterSidebar');

  // Funkcja do wczytywania plików tekstowych
  function loadTextFile(fileUrl) {
    fetch(fileUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Nie udało się wczytać pliku: " + fileUrl);
        }
        return response.text();
      })
      .then(data => {
        const lines = data.split('\n');
        const formattedText = lines.map((line, index) => {
          const className = (index % 2 === 0) ? 'even' : 'odd';
          return `<div class="${className}">${line}</div>`;
        }).join('');
        content.innerHTML = '<pre>' + formattedText + '</pre>';
      })
      .catch(error => {
        console.error("Błąd podczas wczytywania pliku tekstowego: ", error);
        content.innerHTML = '<p>Nie udało się załadować pliku.</p>';
      });
  }

  // Funkcja do wczytywania PDF do iframe
  function loadPdf(fileUrl) {
    pdfViewer.src = fileUrl;
    pdfViewer.style.display = 'block';
    content.innerHTML = '';
    console.log("Załadowano plik PDF do iframe: " + fileUrl);
  }

  // Funkcja do dostosowywania odstępów
  function adjustSpacing() {
    const navItems = document.querySelectorAll('#folderList .nav-item');
    navItems.forEach(item => {
      item.classList.remove('file');
      item.classList.remove('folder');
    });

    navItems.forEach((current, index) => {
      if (current.querySelector('ul') !== null) {
        current.classList.add('folder');
        current.style.marginBottom = '20px';
      } else {
        current.classList.add('file');
        current.style.marginBottom = '0';
      }
    });
  }

  // Dodanie obsługi kliknięcia dla folderów
  folderList.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const subList = this.querySelector('ul');
      if (subList) {
        subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
        adjustSpacing();
      }
    });
  });

  // Przechwycenie kliknięcia w linki plików
  folderList.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
      const fileUrl = this.getAttribute('href');
      if (fileUrl && !fileUrl.endsWith('/')) {
        event.preventDefault();
        console.log("Kliknięto na plik: " + fileUrl);
        if (fileUrl.endsWith('.txt')) {
          loadTextFile(fileUrl);
        } else if (fileUrl.endsWith('.pdf')) {
          loadPdf(fileUrl);
        } else {
          console.log("Nieobsługiwany typ pliku: " + fileUrl);
        }
      } else {
        console.log("Kliknięto na folder, nie na plik: " + fileUrl);
      }
    });
  });

  // Wywołujemy funkcję przy załadowaniu strony
  adjustSpacing();
  
});
