"use strict";
const express = require('express');
const router = express.Router();
const path = require('path');
router.use(express.json());
const userProfile = require('../models/userProfile');
require('dotenv').config();
//const CosmosClient = require('@azure/cosmos').CosmosClient;
//const { callbackify } = require('util');

//Cosmos DataBase & container Name
const databaseId = process.env.DATABASE_NAME;
const containerId = process.env.USERPROFILE_CONTAINER;
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] };

//cosmos db schema and container
const client = userProfile.getClient();
const database = client.database(databaseId);
const container = database.container(containerId);

// User Define upsert function 
const upsertDocumentAsync = async (doc) => {
    const result = container.items.upsert(doc);
    return result;
};

//delete
const deleteDocumentAsync = async (id, partitionKey) => {
    const result = container.item(id, partitionKey).delete();
    return result;
}

//Create and Update a UserProfile in a Container
router.post("/api/v1/userprofile/:id",async(req, res) => {
    try {
        const id = req.params.id;
        const image = req.body.image;
        var ext = path.extname(image);
        console.log(ext); 
        const imgBuff = new Buffer.from(image);
        const base64Data = imgBuff.toString('base64');
        const query = {        
            query: `SELECT * FROM c WHERE (c.id='${id}')`           
        };
        // Reading items in the Items container
        let {resources: userData } = await container.items.query(query).fetchAll();

        if (userData.length === 0) {
            //Insert new data to cosmos db
            let {resource: createData} = await upsertDocumentAsync({base64Data, id, id});
            return res.status(200).send({message:"Inserted Imagedata : ", createData});
        } else {
            //Update the existing data to cosmos db
            let {resource: updateData} = await upsertDocumentAsync({base64Data, id, id});
            return res.status(200).send({message:"Updated Imagedata: ", updateData});
        }
    } catch (error) {
        return res.status(404).send({message:"Please provide valid data"});
    }

})

  
//Get a UserProfile with respect to emailId
router.get("/api/v1/userprofile", async(req, res) => {
    try {
        const id = req.query.id;
            const query = {        
                query: `SELECT * FROM c WHERE (c.id='${id}')`
            };
            // Reading all items in the Items container
            let {resources: userData} = await container.items.query(query).fetchAll();
            if (userData.length != 0) {
                return res.status(200).send({message:"User profile for the emailid: ", userData});
            }else{
                return res.status(404).send({message:"Email Id Doesnot exists in DB or Please Provide the valid EmailId!!!"});
            }
    }catch (error) {
        return res.status(500).send(error);
    }
});

//Get all UserProfile in a Profile Container
router.get("/api/v1/userprofiles", async(req, res) => {
    try {
        const queryphoto = {        
            query: "SELECT * FROM c"
        };
        // Reading all items in the Items container
        let {resources: userData} = await container.items.query(queryphoto).fetchAll();
            return res.status(200).send({message:"User profiles: ", userData});
    }catch (error) {
        return res.status(404).send({message:"Data is Not Available in DB "});
    }
});

//Delete a UserProfile for an emailId
router.delete("/api/v1/userprofile", async(req, res) => {
    try {
        const id = req.query.id; 
            const queryphoto = {        
                query: `SELECT * FROM c  WHERE (c.id='${id}')`            
            };
            // Reading items in the Items container
            const {resources: userData} = await container.items.query(queryphoto).fetchAll();
            if (userData.length === 0) {
                return res.status(404).send({message:"ID doesnot exist in  Database or Please Provide the valid EmailId"});
            } else {
                const {resource: deleteEmailId} = await deleteDocumentAsync(id, id);
                return res.status(200).send({message:"Deleted the record from  Database ",deleteEmailId});
            }
    }catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;