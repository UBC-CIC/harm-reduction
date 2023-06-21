"use client"; 

import React, { useState } from 'react';
import {
    Box,
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
// });

const data = [
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
  { date: '2023-05-25', contents: 'Cocaine', testResults: 'Cocaine: 100%' },
  { date: '2023-05-28', contents: 'Methamphetamine', testResults: 'Methampetamine: 98%, Glucose: 2%' },
  { date: '2023-05-27', contents: 'Marijuana', testResults: 'Marijuana: 100%' },
  { date: '2023-04-23', contents: 'Heroin', testResults: 'Heroin: 99%, Fentanyl: 1%' },
];

const PAGE_SIZE = 5;

const PublicTable = () => {
  const [searchContents, setSearchContents] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleContentsSearch = (event) => {
    setSearchContents(event.target.value);
    setCurrentPage(0);
  };

  const handleResultsSearch = (event) => {
    setSearchResults(event.target.value);
    setCurrentPage(0);
  };

  const filteredData = data
    .filter(
      (item) =>
        item.contents.toLowerCase().includes(searchContents.toLowerCase()) &&
        item.testResults.toLowerCase().includes(searchResults.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const handleClickPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTableRows = () => {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filteredData.slice(startIndex, endIndex).map((item, index) => (
      <TableRow key={index}>
        <TableCell>{item.date}</TableCell>
        <TableCell>{item.contents}</TableCell>
        <TableCell>{item.testResults}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2rem',
            backgroundColor: 'white', 
            height: '100vh', 
            width: '100vw',
            padding: 0, 
        }}
    >
        <div 
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2rem',
            }}  
        >
            <TextField
                style={{marginRight: '1rem'}}
                label="Search by Contents"
                variant="outlined"
                value={searchContents}
                onChange={handleContentsSearch}
            />
            <TextField
                style={{marginRight: '1rem'}}
                label="Search by Test Results"
                variant="outlined"
                value={searchResults}
                onChange={handleResultsSearch}
            />
      </div>
      <TableContainer component={Paper} style={{width: '80%', marginTop: '2rem',}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Expected Contents</TableCell>
              <TableCell>Test Results</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem',}}>
        {Array.from(Array(totalPages).keys()).map((pageNumber) => (
          <Button
            key={pageNumber}
            style={{marginLeft: '1rem', color: 'black',}}
            variant={currentPage === pageNumber ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleClickPage(pageNumber)}
          >
            {pageNumber + 1}
          </Button>
        ))}
      </div>
    </Box>
  );
};

export default PublicTable;
