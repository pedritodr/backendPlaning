require("dotenv").config;
//ENTIDAD DEL WORKER POOL
const workerpool = require("workerpool");

//HTTP CLIENT
const axios = require("axios");
//CLIENT LOGGER
//const logger = require("../../config/winston");
const used = process.memoryUsage();

const pushDocumentToFtp = async(data, planing) => {
    try {
        console.log(data, planing)
        for (const da of data) {
            //console.log(da.numberDocument)
            if (typeof da !== "undefined") {
                let bodyParams = {
                    RucEmpresa: "0992153563001",
                    TipoDocumento: "01",
                    Establecimiento: "028",
                    PtoEmision: "102",
                    Secuencial: "000050264",
                    NombreArchivo: "Factura-028-102-000050264",
                    Xml: true,
                    Pdf: false,
                    AnioDocumento: "2021"
                };
                //    console.log(bodyParams, process.env.ENDPOINT_API_STUPENDO)

                //   const response = await axios.post(process.env.ENDPOINT_API_STUPENDO, bodyParams);
                //     console.log('cs')
                //  console.log('response:' + response)
                //   console.log(da.numberDocument)
                /*  var bodyParams = JSON.stringify(da);
                 const resultPetition = await axios.post(
                     process.env.ENDPOINT_API_MIGRACION,
                     bodyParams
                 );
                 const document = await Documents.findOne({
                     where: {
                         id_documento: da.idDocumento,
                     },
                 });
                 if (resultPetition.data.result) {
                     document.estado_migracion = 1;
                     await document.save();
                     logger.log({
                         level: "info",
                         status: "procesado",
                         message: `ID DOCUMENTO ${da.idDocumento}`,
                         date: new Date().toString(),
                         env: process.env.NODE_ENV,
                     });
                 } else {
                     document.estado_migracion = 3;
                     await document.save();
                     logger.log({
                         level: "error",
                         status: "no procesado",
                         message: `ID DOCUMENTO ${da.idDocumento}`,
                         error_message: resultPetition.data.message,
                         date: new Date().toString(),
                         env: process.env.NODE_ENV,
                     });
                 } */
            }
        }
    } catch (error) {
        /*      logger.log({
                 level: "error",
                 status: `no procesado error: ${error}`,
                 message: `ID DOCUMENTO ${da.idDocumento}`,
                 error_message: resultPetition.data.message,
                 date: new Date().toString(),
                 env: process.env.NODE_ENV,
             }); */
    }
};

workerpool.worker({
    pushDocumentToFtp
});