"use client"; 

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';

// const useStyles = makeStyles({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginTop: '2rem',
//     backgroundColor: 'white',
//     height: '100vh',
//     width: '100vw',
//     margin: 0,
//     padding: 0,
//   },
//   tableContainer: {
//     width: '80%',
//     marginTop: '2rem',
//   },
//   searchContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '2rem',
//   },
//   searchInput: {
//     marginRight: '1rem',
//   },
//   paginationContainer: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginTop: '2rem',
//   },
//   paginationButton: {
//     marginLeft: '1rem',
//     color: 'black',
//   },
//   editableCell: {
//     minWidth: '150px',
//   },
// });

const data = [
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  {
    sampleId: 'S1',
    status: 'Pending',
    expectedContents: '',
    color: '',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: '',
    date: '2023-05-25',
  },
  {
    sampleId: 'S2',
    status: 'Completed',
    expectedContents: 'Methamphetamine',
    color: 'white',
    notes: '',
    testingMethod: 'HPLC',
    location: 'Vancouver',
    testResults: 'Methamphetamine 100%',
    date: '2023-05-28',
  },
  
  // Add more data here...
];

const PAGE_SIZE = 5;

const AdminTable = () => {
  const [searchContents, setSearchContents] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleContentsSearch = (event) => {
    setSearchContents(event.target.value);
  };

  const handleResultsSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const renderTableRows = () => {
    // Apply filtering based on searchContents and searchResults
    let filteredData = data;

    if (searchContents) {
      filteredData = filteredData.filter(
        (item) =>
          item.expectedContents.toLowerCase().includes(searchContents.toLowerCase()) ||
          item.notes.toLowerCase().includes(searchContents.toLowerCase())
      );
    }

    if (searchResults) {
      filteredData = filteredData.filter(
        (item) => item.testResults.toLowerCase().includes(searchResults.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = currentPage * PAGE_SIZE;
    const visibleData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

    return visibleData.map((item, index) => (
      <TableRow key={index}>
        <TableCell>{item.sampleId}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>{item.expectedContents}</TableCell>
        <TableCell>{item.color}</TableCell>
        <TableCell>
          <TextField
            defaultValue={item.notes}
            fullWidth
            multiline
            InputProps={{
              className: {
                minWidth: '150px',
              }
            }}
          />
        </TableCell>
        <TableCell>{item.testingMethod}</TableCell>
        <TableCell>{item.location}</TableCell>
        <TableCell>{item.testResults}</TableCell>
        <TableCell>{item.date}</TableCell>
      </TableRow>
    ));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageCount = Math.ceil(data.length / PAGE_SIZE);

  return (
    <div 
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2rem',
            backgroundColor: 'white',
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
        }}
    >
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem',}}>
        <TextField
          style={{marginRight: '1rem',}}
          label="Filter by Contents"
          value={searchContents}
          onChange={handleContentsSearch}
        />
        <TextField
          style={{marginRight: '1rem',}}
          label="Filter by Test Results"
          value={searchResults}
          onChange={handleResultsSearch}
        />
      </div>
      <TableContainer component={Paper} style={{width: '80%', marginTop: '2rem',}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sample ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expected Contents</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Testing Method</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Test Results</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem',}}>
        {Array.from({ length: pageCount }, (_, i) => (
          <Button
            key={i}
            style={{marginLeft: '1rem', color: 'black',}}
            variant="outlined"
            onClick={() => handlePageChange(i)}
            disabled={currentPage === i}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
