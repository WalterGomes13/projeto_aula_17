document.addEventListener('DOMContentLoaded', () => {
    let obras = JSON.parse(localStorage.getItem('obras')) || [];
  
    function renderObras() {
        const container = document.getElementById('obrasContainer');
        if (!container) {
            console.error('Elemento com id "obrasContainer" não encontrado.');
            return;
        }
        container.innerHTML = '';
  
        obras.forEach((obra, index) => {
            const obraDiv = document.createElement('div');
            obraDiv.className = 'obra';
  
            const nome = document.createElement('h2');
            nome.textContent = `Nome: ${obra.nome}`;
            obraDiv.appendChild(nome);
  
            const local = document.createElement('p');
            local.textContent = `Local: ${obra.local}`;
            obraDiv.appendChild(local);
  
            const orcamento = document.createElement('p');
            orcamento.textContent = `Orçamento: ${obra.orcamento}`;
            obraDiv.appendChild(orcamento);
  
            const progresso = document.createElement('p');
            progresso.textContent = `Progresso: ${obra.progresso}%`;
            obraDiv.appendChild(progresso);
  
            const cliente = document.createElement('p');
            cliente.textContent = `Cliente: ${obra.cliente}`;
            obraDiv.appendChild(cliente);
  
            const imagem = document.createElement('img');
            imagem.src = obra.imagem;
            obraDiv.appendChild(imagem);
  
            const assinaturaLabel = document.createElement('label');
            assinaturaLabel.textContent = 'Assinatura do Fiscal:';
            obraDiv.appendChild( assinaturaLabel);
  
            const assinaturaInput = document.createElement('input');
            assinaturaInput.type = 'text';
            assinaturaInput.name = `assinatura_${index}`;
            assinaturaInput.id = `assinatura_${index}`;
            obraDiv.appendChild(assinaturaInput);
  
            const pdfButton = document.createElement('button');
            pdfButton.textContent = 'Gerar PDF';
            pdfButton.onclick = () => generatePDF(obra, assinaturaInput.value);
            obraDiv.appendChild(pdfButton);
  
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar Obra';
            deleteButton.onclick = () => deleteObra(index);
            obraDiv.appendChild(deleteButton);
  
            container.appendChild(obraDiv);
        });
    }
  
    function generatePDF(obra, assinatura) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
  
        doc.text(`Nome: ${obra.nome}`, 10, 10);
        doc.text(`Local: ${obra.local}`, 10, 20);
        doc.text(`Orçamento: ${obra.orcamento}`, 10, 30);
        doc.text(`Progresso: ${obra.progresso}%`, 10, 40);
        doc.text(`Cliente: ${obra.cliente}`, 10, 50);
        doc.text(`Assinatura do Fiscal: ${assinatura}`, 10, 60);
  
        if (obra.imagem) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = obra.imagem;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL('image/jpeg');
                doc.addImage(imgData, 'JPEG', 10, 70, 100, 100);
                doc.save(`${obra.nome}.pdf`);
            };
            img.onerror = () => {
                doc.save(`${obra.nome}.pdf`);
            };
        } else {
            doc.save(`${obra.nome}.pdf`);
        }
    }
  
    function deleteObra(index) {
        obras.splice(index, 1);
        localStorage.setItem('obras', JSON.stringify(obras));
        renderObras();
    }
  
    document.getElementById('relatorioForm').addEventListener('submit', (event) => {
        event.preventDefault();
  
        const nome = document.getElementById('nome').value;
        const local = document.getElementById('local').value;
        const orcamento = document.getElementById('orcamento').value;
        const progresso = document.getElementById('progresso').value;
        const cliente = document.getElementById('cliente').value;
        const imagemInput = document.getElementById('imagem');
        let imagem = '';
  
        if (imagemInput.files && imagemInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagem = e.target.result;
                saveObra({ nome, local, orcamento, progresso, cliente, imagem });
            };
            reader.readAsDataURL(imagemInput.files[0]);
        } else {
            saveObra({ nome, local, orcamento, progresso, cliente, imagem });
        }
    });
  
    function saveObra(obra) {
        obras.push(obra);
        localStorage.setItem('obras', JSON.stringify(obras));
        alert('Obra registrada com sucesso!');
        document.getElementById('relatorioForm').reset();
        renderObras();
    }
  
    renderObras();
  });
  