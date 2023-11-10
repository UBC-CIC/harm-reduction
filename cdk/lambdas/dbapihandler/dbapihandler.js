const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const headers = {
  "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS"
}

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  const resource = event.requestContext.resourcePath;
  const tableName = event.queryStringParameters['tableName']
  //let tableName = (resource === '/users') ? 'harm-reduction-users' : 'harm-reduction-samples';
  

  if (httpMethod === 'POST') {
    return await createItem(tableName, JSON.parse(body));
  } else if (httpMethod === 'PUT') {
    return await updateItem(tableName, JSON.parse(body));
  } else if (httpMethod === 'GET') {
    if (tableName === 'harm-reduction-users') {
      const userColumns = event.queryStringParameters['columns'];
      const userSampleId = event.queryStringParameters['sample-id'];
      if (userColumns){
        return getCensoredUser(tableName, userSampleId, userColumns)
      }
      else{
        return await getUser(tableName, userSampleId);
      }
    } else if (tableName === 'harm-reduction-samples') {
      const sampleId = event.queryStringParameters['sample-id'];
      const columns = event.queryStringParameters['columns'];
      const status = event.queryStringParameters['status'];
      if (sampleId) {
        return await getSample(tableName, sampleId);
      }
      else if (columns) {
        return await getAllPublicSampleData(tableName, columns, status);
      } else {
        return await getAllSamples(tableName);
      }
    }
  } else if (httpMethod === 'DELETE') {
    return await deleteItem(tableName, event.queryStringParameters['sample-id']);
  } else if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: headers,
      body: JSON.stringify({ message: 'No content' }),
    }
  }

  return {
    statusCode: 400,
    headers: headers,
    body: JSON.stringify({ message: 'Invalid request' }),
  };
};

async function createItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify({ message: 'Item created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to create item', error }),
    };
  }
}

async function updateItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: 'Item updated successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to update item', error }),
    };
  }
}

async function getUser(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers, 
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getCensoredUser(tableName, sampleId, columns) {
  const params = {
    TableName: tableName,
    ProjectionExpression: columns,
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers, 
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getSample(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve item', error }),
    };
  }
}

async function getAllSamples(tableName) {
  const params = {
    TableName: tableName,
  };

  try {
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve items', error }),
    };
  }
}

async function getAllPublicSampleData(tableName, columns, status) {
  const columnsOriginal = columns.split(',');
  
  const columnsModified = columnsOriginal.map(column => {
    return `#${column.replace(/-/g, '_')}`; // Replace hyphens with underscores in attribute names
  });
  
  const expressionAttributeNames = {};
  for (let i = 0; i < columnsOriginal.length; i++) {
    expressionAttributeNames[columnsModified[i]] = columnsOriginal[i];
  }
  
  const params = {
    TableName: tableName,
    ProjectionExpression: columnsModified.join(', '),
    ExpressionAttributeNames: expressionAttributeNames,
    FilterExpression: '#status = :status', // Use an alias for "status"
    ExpressionAttributeValues: {
      ':status': status,
    },
  };

  try {
    const { Items } = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to retrieve items', error }),
    };
  }
}

async function deleteItem(tableName, sampleId) {
  const params = {
    TableName: tableName,
    Key: { 'sample-id': sampleId },
  };

  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: 'Item deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Failed to delete item', error }),
    };
  }
}
