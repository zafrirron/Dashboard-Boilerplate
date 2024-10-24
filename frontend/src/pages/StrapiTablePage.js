import React from 'react';
import StrapiTable from "../components/StrapiTable";

function StrapiForm(props) {
  return (
    <>
      <div>
      <h1>{props.tableName}</h1>
      </div>
      <div>
        {/* Pass the Strapi collection name, collection type name, collection additional metadata name as a prop */}
        <StrapiTable collectionName={props.collectionName}  collectionTypeName={props.collectionTypeName} collectionMetaName={props.collectionMetaName}/>
      </div>
    </>
  );
}

export default StrapiForm;  // This is a default export
