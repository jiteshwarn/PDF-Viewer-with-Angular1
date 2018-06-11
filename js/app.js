var pdfData, viewerContainer, viewer, pdfLinkService, pdfViewer, pdfFindController;
var pdfjsDistBuildPdf = window['pdfjs-dist/build/pdf'];
var pdfjsDistWebPdfViewer = window['pdfjs-dist/web/pdf_viewer'];
pdfjsDistBuildPdf.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js';

function getDocument() {
  var loadingTask = pdfjsDistBuildPdf.getDocument({ data: pdfData });
  loadingTask.promise.then(function (response) {
    console.log('PDF loaded');
    pdfDoc = response;
    var pageNumber = 1;
    var pageCount = pdfDoc.numPages;
    // Initial/first page rendering
    pdfViewer.setDocument(pdfDoc);
    pageCount = pdfViewer.pdfDocument.numPages;
    pdfLinkService.setDocument(pdfDoc, null);
  }, function (reason) {
  });
}

var promise = new Promise(function (resolve, reject) {
  var byte64Data = data;
  resolve(byte64Data);
});

promise.then(function (response) {
  pdfData = atob(response);
  viewerContainer = document.getElementById('viewerContainer');
  viewer = document.getElementById('viewer');
  pdfLinkService = new pdfjsDistWebPdfViewer.PDFLinkService();

  pdfViewer = new pdfjsDistWebPdfViewer.PDFSinglePageViewer({
    container: viewerContainer,
    viewer: viewer
  });

  pdfLinkService.setViewer(pdfViewer);

  pdfFindController = new pdfjsDistWebPdfViewer.PDFFindController({
    pdfViewer: pdfViewer
  });
  pdfViewer.setFindController(pdfFindController);
  getDocument();
})