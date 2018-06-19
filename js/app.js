var app = angular.module('pdfviewerApp', []);
app.controller('CountCtrl', function ($scope,$timeout) {
  var vm = this;
  vm.searchText = "";
  vm.pageNumber = 0;
  vm.pageCount = 0;
  vm.isLoadingData = false;
  vm.highlightAll = false;
  vm.caseSensitive = false;
  vm.findPrevious = false;
  vm.showScale = false;
  var pdfData, viewer, pdfLinkService, pdfViewer, pdfFindController;
  var pdfjsDistBuildPdf = window['pdfjs-dist/build/pdf'];
  var pdfjsDistWebPdfViewer = window['pdfjs-dist/web/pdf_viewer'],
  canvas = null,
  ctx = null;
  pdfjsDistBuildPdf.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js';

  function getDocument() {
    var loadingTask = pdfjsDistBuildPdf.getDocument({ data: pdfData });
    loadingTask.promise.then(function (response) {
      console.log('PDF loaded');
      pdfDoc = response;
      vm.pageNumber = 1;
      vm.pageCount = pdfDoc.numPages;
      console.log(vm.pageNumber,vm.pageCount);
      // Initial/first page rendering
      vm.pdfViewer.setDocument(pdfDoc);
      //vm.pageCount = pdfViewer.pdfDocument.numPages;
      vm.pdfLinkService.setDocument(pdfDoc, null);
    }, function (reason) {
    });
  }

  var promise = new Promise(function (resolve, reject) {
    var byte64Data = data;
    resolve(byte64Data);
  });

  promise.then(function (response) {
    pdfData = atob(response);
     canvas = document.getElementById('the-canvas');
    ctx = canvas.getContext('2d');
    vm.viewerContainer = document.getElementById('viewerContainer');
    vm.viewer = document.getElementById('viewer');
    vm.pdfLinkService = new pdfjsDistWebPdfViewer.PDFLinkService();

    vm.pdfViewer = new pdfjsDistWebPdfViewer.PDFSinglePageViewer({
      container: vm.viewerContainer,
      viewer: vm.viewer
    });

    vm.pdfLinkService.setViewer(vm.pdfViewer);

    vm.pdfFindController = new pdfjsDistWebPdfViewer.PDFFindController({
      pdfViewer: vm.pdfViewer
    });
    vm.pdfViewer.setFindController(vm.pdfFindController);
    vm.viewerContainer .addEventListener('pagesinit', function () {
        vm.pdfViewer.currentScaleValue = 'page-width';
        angular.element("#prev").click();
    });


    getDocument();
  })
  vm.searchWord = function () {
    if (vm.searchText) {
      vm.pdfFindController.executeCommand('find', {
        caseSensitive: vm.caseSensitive,
        findPrevious: vm.findPrevious,
        highlightAll: vm.highlightAll,
        phraseSearch: false,
        query: vm.searchText
      });
      $timeout(function () {
        vm.pageNumber = vm.pdfFindController.pdfViewer._currentPageNumber;
      }, 500);
    }
    else {
      vm.searchOptions = false;
    }
  }

  vm.searchNextWord = function () {
    vm.searchOptions = false;
    if (vm.searchText) {
      vm.pdfFindController.executeCommand('findagain', {
        caseSensitive: vm.caseSensitive,
        findPrevious: vm.findPrevious,
        highlightAll: vm.highlightAll,
        phraseSearch: false,
        query: vm.searchText
      });
      vm.pdfFindController._firstPagePromise.then(function (response) {
        vm.pageNumber = vm.pdfFindController.pdfViewer._currentPageNumber;
      }, function (response) {
        console.log("Search Error :", response);
      });
    }
  }

  vm.previousPage = function () {
    if (vm.pageNumber > 1 && vm.pageNumber <= pdfDoc.numPages) {
      vm.pageNumber--;
      vm.pdfViewer._scrollIntoView({ pageNumber: parseInt(vm.pageNumber), pageDiv: vm.viewer });
    }
  }

  vm.nextPage = function () {
    if (vm.pageNumber >= 1 && vm.pageNumber < pdfDoc.numPages) {
      vm.pageNumber++;
      vm.pdfViewer._scrollIntoView({ pageNumber: parseInt(vm.pageNumber), pageDiv: vm.viewer });
    }
  }

  vm.gotoPage = function () {
    if (vm.pageNumber > pdfDoc.numPages) {
      vm.pageNumber = pdfDoc.numPages;
    }
    else if (vm.pageNumber < 1) {
      vm.pageNumber = 1;
    }
    vm.pdfViewer._scrollIntoView({ pageNumber: parseInt(vm.pageNumber), pageDiv: vm.viewer });
  }

  vm.zoomIn = function () {
    scale = vm.pdfViewer._currentScale;
    if (scale < 2) {
      scale = scale + 0.2;
      vm.pdfViewer._setScale(scale);
    }
  }

  vm.zoomOut = function () {
    scale = vm.pdfViewer._currentScale;
    if (scale > 1) {
      scale = scale - 0.2;
      vm.pdfViewer._setScale(scale);
    }
  }
  vm.setScale = function (scaleValue) {
    vm.pdfViewer._setScale(scaleValue);
  }
});