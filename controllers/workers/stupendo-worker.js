require("dotenv").config;
const path = require('path');
const fs = require('fs');
//ENTIDAD DEL WORKER POOL
const workerpool = require("workerpool");
const AWS = require('aws-sdk');
//HTTP CLIENT
const axios = require("axios");
const searchTypeDocument = require('../../helpers/type-documet');
const logger = require('../../helpers/log4');
const used = process.memoryUsage();

const pushDocumentToFtp = async(data, planing, nameFolder) => {

    try {
        const AWSBucket = "ec-stupendo-ia";
        AWS.config.loadFromPath('./s3_config.json');
        planing = JSON.parse(planing);
        const log = logger(planing._id);
        const dateBegin = new Date(planing.date_begin);
        const dateEnd = new Date(planing.date_end);
        const year = dateBegin.toISOString().slice(0, 4);
        const typeDocumentHelper = searchTypeDocument(planing.document_type);
        for (const da of data) {
            console.log(da)
            if (typeof da !== "undefined") {
                const numberInvoice = da.numberDocument;
                const numberDocumentSplit = numberInvoice.split('-');
                if (numberDocumentSplit.length === 3) {
                    const bodyParams = {
                        RucEmpresa: process.env.RUC_COMPANY,
                        TipoDocumento: planing.document_type,
                        Establecimiento: numberDocumentSplit[0],
                        PtoEmision: numberDocumentSplit[1],
                        Secuencial: numberDocumentSplit[2],
                        NombreArchivo: `${typeDocumentHelper.document}-${da.numberDocument}`,
                        Xml: planing.output_format === 1 ? true : false,
                        Pdf: planing.output_format === 2 ? true : false,
                        AnioDocumento: year
                    };

                    const resultPetition = await axios.post(
                        process.env.ENDPOINT_API_STUPENDO,
                        JSON.stringify(bodyParams)
                    );
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
                                            const successData = {
                                                level: "info",
                                                status: `AWS Load file`,
                                                message: `ID DOCUMENTO ${da.numberDocument}`,
                                                date: new Date().toString(),
                                                data_aws: data,
                                                env: process.env.NODE_ENV,
                                            };
                                            log.info(successData);
                                            console.log(data)
                                            console.log("Successfully uploaded");
                                        },
                                        function(err) {
                                            const errorData = {
                                                level: "error",
                                                status: `Error en AWS`,
                                                message: `ID DOCUMENTO ${da.numberDocument}`,
                                                error_message: err.message,
                                                date: new Date().toString(),
                                                env: process.env.NODE_ENV,
                                            };
                                            log.error(errorData);
                                            return alert("There was an error uploading your file: ", err.message);

                                        }
                                    );

                                } catch (error) {
                                    const errorData = {
                                        level: "error",
                                        status: `Error en AWS`,
                                        message: `ID DOCUMENTO ${da.numberDocument}`,
                                        error_message: JSON.stringify(error),
                                        date: new Date().toString(),
                                        env: process.env.NODE_ENV,
                                    };
                                    log.error(JSON.stringify(errorData));
                                    throw new Error('Error AWS');
                                }
                            } else {
                                const errorData = {
                                    level: "error",
                                    status: `Error en el documento`,
                                    body_request: JSON.stringify(bodyParams),
                                    message: `ID DOCUMENTO ${da.numberDocument}`,
                                    error_message: `La factura no esta en el rango seleccionado ${dateBegin.toISOString().slice(0, 10)}-${dateEnd.toISOString().slice(0, 10)}`,
                                    date: new Date().toString(),
                                    env: process.env.NODE_ENV,
                                };
                                log.error(JSON.stringify(errorData));
                            }
                        } else {
                            const errorData = {
                                level: "error",
                                status: `Error en el documento`,
                                body_request: JSON.stringify(bodyParams),
                                message: `ID DOCUMENTO ${da.numberDocument}`,
                                error_message: JSON.stringify(resultPetition.data),
                                date: new Date().toString(),
                                env: process.env.NODE_ENV,
                            };
                            log.error(JSON.stringify(errorData));
                        }
                    }
                } else {
                    const errorData = {
                        level: "error",
                        status: `Error en el documento`,
                        message: `ID DOCUMENTO ${da.numberDocument} formato incorrecto`,
                        error_message: 'No cumple con un formato de documento valido',
                        date: new Date().toString(),
                        env: process.env.NODE_ENV,
                    };
                    log.error(JSON.stringify(errorData));
                }
            }
        }
    } catch (error) {
        console.log(error)
        const errorData = {
            level: "error",
            status: `Error en el documento`,
            message: `Ocurrio algunos problemas`,
            error_message: JSON.stringify(error),
            date: new Date().toString(),
            env: process.env.NODE_ENV,
        };
        log.error(JSON.stringify(errorData));
    }
};

workerpool.worker({
    pushDocumentToFtp
});