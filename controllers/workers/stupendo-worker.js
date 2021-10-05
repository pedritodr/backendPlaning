require("dotenv").config;
const path = require('path');
const fs = require('fs');
//ENTIDAD DEL WORKER POOL
const workerpool = require("workerpool");
const AWS = require('aws-sdk');
//HTTP CLIENT
const axios = require("axios");
const searchTypeDocument = require('../../helpers/type-documet');
//CLIENT LOGGER
//const logger = require("../../config/winston");
const used = process.memoryUsage();

const pushDocumentToFtp = async(data, planing, nameFolder) => {
    try {
        const AWSBucket = "ec-stupendo-ia";
        AWS.config.loadFromPath('./s3_config.json');
        planing = JSON.parse(planing);
        const dateBegin = new Date(planing.date_begin);
        const dateEnd = new Date(planing.date_end);
        const year = dateBegin.getFullYear();
        const typeDocumentHelper = searchTypeDocument(planing.document_type);

        for (const da of data) {
            if (typeof da !== "undefined") {
                let numberDocumentSplit = da.numberDocument.split('-');
                if (numberDocumentSplit.length === 3) {
                    let bodyParams = {
                        RucEmpresa: process.env.RUC_COMPANY,
                        TipoDocumento: planing.document_type,
                        Establecimiento: numberDocumentSplit[0],
                        PtoEmision: numberDocumentSplit[1],
                        Secuencial: numberDocumentSplit[2],
                        NombreArchivo: `${typeDocumentHelper.document}-${da.numberDocument}`,
                        Xml: planing.output_format === 1 ? true : false,
                        Pdf: planing.output_format === 2 ? true : false,
                        AnioDocumento: year.toString()
                    };
                    const resultPetition = await axios.post(
                        process.env.ENDPOINT_API_STUPENDO,
                        JSON.stringify(bodyParams)
                    );
                    if (resultPetition) {
                        if (resultPetition.status === 200) {
                            if (resultPetition.data.Resultado) {
                                let fechaAutorizacion = resultPetition.data.FechaAutorizacion;
                                let fechaSplit = fechaAutorizacion.split(' ');
                                let date = fechaSplit[0].split('/');
                                let dateValid = new Date(`${date[2]}-${date[1]}-${date[0]}`);
                                if (dateValid.getTime() >= dateBegin.getTime() && dateValid.getTime() <= dateEnd.getTime()) {
                                    let ext = '.xml';
                                    let buff;
                                    if (planing.output_format === 2) {
                                        ext = '.pdf';
                                        buff = new Buffer.from(resultPetition.data.Pdf, 'base64');
                                    } else {
                                        buff = new Buffer.from(resultPetition.data.Xml, 'base64');
                                    }
                                    const routePath = path.join(__dirname, '../../', `/temp-uploads/${typeDocumentHelper.document}-${da.numberDocument}${ext}`);
                                    fs.writeFileSync(routePath, buff);
                                    try {
                                        const fileLoad = fs.readFileSync(routePath);
                                        const fileName = `${typeDocumentHelper.document}-${da.numberDocument}${ext}`;
                                        const folderFilesKey = encodeURIComponent(nameFolder) + "/";
                                        var fileKey = folderFilesKey + fileName;
                                        const upload = new AWS.S3.ManagedUpload({
                                            params: {
                                                Bucket: AWSBucket,
                                                Key: fileKey,
                                                Body: fileLoad
                                            }
                                        });

                                        const promise = upload.promise();

                                        promise.then(
                                            function(data) {
                                                fs.unlinkSync(routePath);
                                                console.log(data)
                                                console.log("Successfully uploaded photo.");
                                                //  viewAlbum(albumName);
                                            },
                                            function(err) {
                                                return alert("There was an error uploading your photo: ", err.message);
                                            }
                                        );

                                    } catch (error) {
                                        console.log(error);
                                        throw new Error('Error AWS');
                                    }
                                }
                            }
                        }
                    }
                }
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