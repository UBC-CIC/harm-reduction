import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&': {
    fontSize: 11,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '&': {
    backgroundColor: 'black',
  },
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  '&': {
    color: 'white',
    fontWeight: 'bold',
  },
}));

const SampleTable = () => {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [searchQueryDateReceived, setSearchQueryDateReceived] = useState('');
  const [searchQueryExpectedContent, setSearchQueryExpectedContent] = useState('');
  const [searchQueryTestResults, setSearchQueryTestResults] = useState('');

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await axios.get(
        'https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/samples?tableName=samples'
      );
      const data = response.data;
      setSamples(data);
      setFilteredSamples(data);
    } catch (error) {
      console.error('Error fetching samples:', error);
    }
  };

  const handleSearchClick = () => {
    const filteredSamples = samples.filter((sample) => {
      return (
        sample['date-received'].includes(searchQueryDateReceived) &&
        sample['expected-content'].includes(searchQueryExpectedContent) &&
        sample['test-results'].includes(searchQueryTestResults)
      );
    });
    setFilteredSamples(filteredSamples);
  };

  const handleResetClick = () => {
    setFilteredSamples(samples);
    setSearchQueryDateReceived('');
    setSearchQueryExpectedContent('');
    setSearchQueryTestResults('');
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <br/>
        <TextField
          label="Date Received"
          variant="outlined"
          size="small"
          value={searchQueryDateReceived}
          onChange={(e) => setSearchQueryDateReceived(e.target.value)}
          style={{ marginRight: '10px', marginLeft: '10px' }}
        />
        <TextField
          label="Expected Contents"
          variant="outlined"
          size="small"
          value={searchQueryExpectedContent}
          onChange={(e) => setSearchQueryExpectedContent(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Test Results"
          variant="outlined"
          size="small"
          value={searchQueryTestResults}
          onChange={(e) => setSearchQueryTestResults(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearchClick} style={{ marginLeft: '10px' }}>
          Search
        </Button>
        <Button variant="contained" onClick={handleResetClick} style={{ marginLeft: '10px' }}>
          Reset
        </Button>
      </div>
      <TableContainer component={Paper} style={{ padding: '10px' }}>
        <Table sx={{ minWidth: 600 }} aria-label="sample table">
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>Date Received</StyledTableHeaderCell>
              <StyledTableHeaderCell>Expected Contents</StyledTableHeaderCell>
              <StyledTableHeaderCell>Test Results</StyledTableHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredSamples.map((sample) => (
              <TableRow key={sample['sample-id']}>
                <StyledTableCell>{sample['date-received']}</StyledTableCell>
                <StyledTableCell>{sample['expected-content']}</StyledTableCell>
                <StyledTableCell>{sample['test-results']}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SampleTable;
