"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@custom-react-hooks";
exports.ids = ["vendor-chunks/@custom-react-hooks"];
exports.modules = {

/***/ "(ssr)/./node_modules/@custom-react-hooks/use-media-query/dist/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/@custom-react-hooks/use-media-query/dist/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.useMediaQuery = void 0;\r\nvar react_1 = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\r\nvar getMatches = function (mediaQuery) {\r\n    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {\r\n        return false;\r\n    }\r\n    return window.matchMedia(mediaQuery).matches;\r\n};\r\nfunction useMediaQuery(query) {\r\n    var _a = (0, react_1.useState)(getMatches(query)), matches = _a[0], setMatches = _a[1];\r\n    var handleChange = (0, react_1.useCallback)(function (event) {\r\n        setMatches(event.matches);\r\n    }, []);\r\n    (0, react_1.useEffect)(function () {\r\n        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {\r\n            return;\r\n        }\r\n        var mediaQueryList = window.matchMedia(query);\r\n        mediaQueryList.addEventListener('change', handleChange);\r\n        return function () {\r\n            mediaQueryList.removeEventListener('change', handleChange);\r\n        };\r\n    }, [query, handleChange]);\r\n    return matches;\r\n}\r\nexports.useMediaQuery = useMediaQuery;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQGN1c3RvbS1yZWFjdC1ob29rcy91c2UtbWVkaWEtcXVlcnkvZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxxQkFBcUI7QUFDckIsY0FBYyxtQkFBTyxDQUFDLGlHQUFPO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EscUJBQXFCIiwic291cmNlcyI6WyJHOlxcc2hpc2hpciB2YWlcXEVhcm5Db3JlQ29tbXVuaXR5XFxjbGllbnRcXG5vZGVfbW9kdWxlc1xcQGN1c3RvbS1yZWFjdC1ob29rc1xcdXNlLW1lZGlhLXF1ZXJ5XFxkaXN0XFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnVzZU1lZGlhUXVlcnkgPSB2b2lkIDA7XHJcbnZhciByZWFjdF8xID0gcmVxdWlyZShcInJlYWN0XCIpO1xyXG52YXIgZ2V0TWF0Y2hlcyA9IGZ1bmN0aW9uIChtZWRpYVF1ZXJ5KSB7XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5tYXRjaE1lZGlhID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzO1xyXG59O1xyXG5mdW5jdGlvbiB1c2VNZWRpYVF1ZXJ5KHF1ZXJ5KSB7XHJcbiAgICB2YXIgX2EgPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoZ2V0TWF0Y2hlcyhxdWVyeSkpLCBtYXRjaGVzID0gX2FbMF0sIHNldE1hdGNoZXMgPSBfYVsxXTtcclxuICAgIHZhciBoYW5kbGVDaGFuZ2UgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgc2V0TWF0Y2hlcyhldmVudC5tYXRjaGVzKTtcclxuICAgIH0sIFtdKTtcclxuICAgICgwLCByZWFjdF8xLnVzZUVmZmVjdCkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93Lm1hdGNoTWVkaWEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG1lZGlhUXVlcnlMaXN0ID0gd2luZG93Lm1hdGNoTWVkaWEocXVlcnkpO1xyXG4gICAgICAgIG1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUNoYW5nZSk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWVkaWFRdWVyeUxpc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlQ2hhbmdlKTtcclxuICAgICAgICB9O1xyXG4gICAgfSwgW3F1ZXJ5LCBoYW5kbGVDaGFuZ2VdKTtcclxuICAgIHJldHVybiBtYXRjaGVzO1xyXG59XHJcbmV4cG9ydHMudXNlTWVkaWFRdWVyeSA9IHVzZU1lZGlhUXVlcnk7XHJcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@custom-react-hooks/use-media-query/dist/index.js\n");

/***/ })

};
;