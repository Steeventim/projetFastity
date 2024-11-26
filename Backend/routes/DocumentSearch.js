const fastify = require('fastify')();
const cors = require('fastify-cors');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { StandardFonts, rgb } = require('pdf-lib');
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch-serverless');

fastify.register(cors);

fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  reply.header('Access-Control-Allow-Headers', 'Content-Type');
  done();
});

const esClient = new Client({
  node: 'http://10.42.0.35:9200/',
});

// ________________________ le Endpoint pour interroger Elasticsearch____________________________
fastify.get('/search/:body', async (request, reply) => {
  const body = request.params.body;
  try {
    const response = await esClient.search({
      index: process.env.INDEX,
      body: {
        query: {
          match: {
            content: body
          }
        }
      }
    });
    if (response.hits.total.value == 0) {
      console.log("this index not yet exist");
    } else {
      console.log("je t'ai trouvééééé");
      console.log("hum maitenant affiche alors")
    }

    console.log(response)
    reply.send(response);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
});

// _________________le endpoint pour insérer un document ou un truc  dans Elasticsearch_____________________________
fastify.post('/index', async (request, reply) => {
  try {
    const { index, id, body } = request.body;

    const response = await esClient.index({
      index,
      id,
      body: {
        query: {
          match: {
            _all: body
          }
        }
      }
    });
    console.log("eeee");
    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(406).send({ error: 'Une erreur est survenue lors de l\'indexation poutrtant jai mis sous format JSON' });
  }
});

// les fonctions de recherche  index et document 

//________________recherche d'un index qui donne quand elle veut_______________________________________
fastify.get('/searchss/:index', async (request, reply) => {
  try {
    const { index, body } = request.body;

    const response = await esClient.search({
      index,
      body: {
        query: {
          match: {
            author: body
          }
        }
      }
    });
    console.log(response)
    reply.send(response);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
});

// __________________fonctions de recherche d'un index____________________________________
fastify.get('/index/:index', async (request, reply) => {
  try {
    const { index } = request.params;

    const response = await esClient.indices.exists({
      index
    });

    reply.send(response);
    console.log(response)
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche de l\'index' });
  }
});

//_____________________fonctions de suppression _________________________________________

//foncton de suppression d'un document
fastify.delete('/index/:index/:id', async (request, reply) => {
  try {
    const { index, id } = request.params;

    const response = await esClient.delete({
      index,
      id
    });

    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la suppression du document' });
  }
});
//fonction de suppression d'un index
fastify.delete('/index/:index', async (request, reply) => {
  try {
    const { index } = request.params;

    const response = await esClient.indices.delete({
      index
    });

    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la suppression de l\'index' });
  }
});
fastify.post('/index/:index', async (request, reply) => {
  try {
    const { index } = request.params;
    const { id, body } = request.body;

    const response = await esClient.index({
      index,
      id,
      body
    });

    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de l\'ajout du document' });
  }
});



fastify.post('/index', async (request, reply) => {
  try {
    const { index } = request.body;

    const response = await esClient.indices.create({
      index
    });

    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la création de l\'index' });
  }
});


//_____________________fonction de mise à jour(update index and document soit le nom)_____________________________


fastify.put('/index/:index/:id', async (request, reply) => {
  try {
    const { index, id, body } = request.body;

    const response = await esClient.update({
      index,
      id,
      body: {
        doc: body
      }
    });

    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la mise à jour du document' });
  }
});



fastify.get('/SearchHighligth', async (request, reply) => {
  try {
    const { index, body } = request.body;
    console.log("lajjjjjjjjjj", request);

    const response = await esClient.search({
      index,
      body: {
        query: {
          match: {
            content: body
          }
        },
        highlight: {
          fields: {
            content: {}
          }
        }
      }
    });

    if (response.hits.total.value === 0) {
      console.log("Aucun résultat trouvé");
    } else {
      const results = response.hits.hits.map(hit => {
        const highlightedContent = hit.highlight.content
          ? hit.highlight.content.map(section => section).value
          : hit._source.content;
        return {
          _id: hit._id,
          highlightedContent
        };
      });
      reply.send(results);
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherbbbbbbbbbbbbbbbche' });

  }
});

fastify.get('/search1Highligth/:searchTerm', async (request, reply) => {
  
  try {
  //  const { body } = request.body;
  const searchTerm = request.params.searchTerm;

    const response = await esClient.search({
      index: process.env.INDEX,
      body: {
        query: {
          match: {
            content:searchTerm
          }
        },
        highlight: {
          fields: {
            content: {
              pre_tags: ['<strong style="font-weight:bold;color:black;">'],
              post_tags: ['</strong>']
            }
          }
        }
      }
    });
    console.log('Paramètres reçus:', request.query);

    if (response.hits.total.value === 0) {
      console.log("This body does not yet exist");
    } else {
      console.log("Je t'ai trouvééééé");
    }

    console.log(response);
    reply.send(response);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
    console.log('Paramètres reçus:', request.query);

  }
});


//rechercher dans un document
fastify.get('/highlight/:documentId/:searchTerm', async (request, reply) => {
  try {
    const documentId = request.params.documentId;
    const searchTerm = request.params.searchTerm;

    // Récupération du document depuis Elasticsearch
    const response = await esClient.get({
      index: process.env.INDEX,
      id: documentId
    });

    const content = response._source.content;
    const regex = new RegExp(`(${searchTerm})`, 'gi');

    // Création d'un document PDF
    const doc = new PDFDocument();

    // Définir l'en-tête de la réponse pour indiquer un fichier PDF
    reply.header('Content-Type', 'application/pdf');

    // Streamer le contenu PDF dans la réponse
    console.log(content);
   
    doc.pipe(reply);

    // Décomposer le texte en segments basés sur le mot recherché
    const parts = content.split(regex);

    parts.forEach(part => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        doc.fillColor('yellow').text(part, { continued: true });
      } else {
        doc.fillColor('black').text(part, { continued: true });
      }
    });

    // Finaliser et retourner le document PDF
    doc.end();

  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
});


fastify.get('/highlighte/:documentId/:searchTerm', async (request, reply) => {
  try {
    const documentId = request.params.documentId;
    const searchTerm = request.params.searchTerm;

    const response = await esClient.get({
      index: process.env.INDEX,
      id:documentId
    });

    const highlightedText = response._source.content.replace(new RegExp(searchTerm, 'gi'), match => `<span style="background-color: yellow">${match}</span>`);

    reply.send(`<div style="background-color: lightgrey; padding: 10px;">${highlightedText}</div>`);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
});




const LOCAL_PDF_DIRECTORY ="C:/Users/Hp/Desktop/Document";
// cette methode retourne le entierementle pdf contenant le mot recherché
fastify.get('/highlighter/:documentId/:searchTerm', async (request, reply) => {
  try {
    const documentId = request.params.documentId;
    const searchTerm = request.params.searchTerm;

    // Récupération du document depuis Elasticsearch
    const response = await esClient.get({
      index:process.env.INDEX,
      id: documentId
    });

    const fileName = response._source.file.filename; // Nom du fichier retourné par Elasticsearch
    console.log(fileName);

    // Chemin du fichier local
    const localFilePath = path.join(LOCAL_PDF_DIRECTORY, fileName);

    // Vérifiez si le fichier local existe
    if (fs.existsSync(localFilePath)) {
      reply.sendFile(localFilePath);
    } else {
      // Si le fichier local n'existe pas, continuez avec la génération du PDF
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();

      reply.header('Content-Type', 'application/pdf');
      doc.pipe(reply);

      const content = response._source.content;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = content.split(regex);

      parts.forEach(part => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          doc.fillColor('yellow').text(part, { continued: true });
        } else {
          doc.fillColor('black').text(part, { continued: true });
        }
      });

      doc.end();
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send('Internal Server Error');
  }
});

// celui ci renvoie la premeire et ma dernire page du document contenant le mot recherché et à defaut  de la présence du document en local affiche un pdf contenant le corp

fastify.get('/highlightere/:documentId/:searchTerm', async (request, reply) => {
  try {
    const documentId = request.params.documentId;
    const searchTerm = request.params.searchTerm;

    // Récupération du document depuis Elasticsearch
    const response = await esClient.get({
      index: process.env.INDEX,
      id: documentId
    });

    const fileName = response._source.file.filename; // Nom du fichier retourné par Elasticsearch
    console.log(fileName);

    // Chemin du fichier local se trouvant dans mon bureaaaaaau oo n'oublie pas je te connais 
    const localFilePath = path.join(LOCAL_PDF_DIRECTORY, fileName);

    // Vérifiez si le fichier local existe
    if (fs.existsSync(localFilePath)) {
      // Lire le fichier PDF
      const existingPdfBytes = fs.readFileSync(localFilePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Extraction des première et dernière pages
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const lastPage = pages[pages.length - 1];

      // Création d'un nouveau document PDF
      const newPdfDoc = await PDFDocument.create();
      const [firstPageCopy] = await newPdfDoc.copyPages(pdfDoc, [0]);
      const [lastPageCopy] = await newPdfDoc.copyPages(pdfDoc, [pages.length - 1]);

      newPdfDoc.addPage(firstPageCopy);
      newPdfDoc.addPage(lastPageCopy);

      const pdfBytes = await newPdfDoc.save();

      // Envoi du fichier PDF en résponse
      reply.header('Content-Type', 'application/pdf');
      reply.send(Buffer.from(pdfBytes));
    } else {
      // Si le fichier local n'existe pas, continuez avec la génération du PDF
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();

      reply.header('Content-Type', 'application/pdf');
      doc.pipe(reply);

      const content = response._source.content;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = content.split(regex);

      parts.forEach(part => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          doc.fillColor('yellow').text(part, { continued: true });
        } else {
          doc.fillColor('black').text(part, { continued: true });
        }
      });

      doc.end();
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send('Internal Server Error');
  }
});

// Démarrer le serveur Fastify

fastify.listen(3000, (err) => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})

module.exports = fastify;