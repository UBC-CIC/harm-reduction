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
  Box
} from '@mui/material';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const REGION = process.env.REACT_APP_AWS_REGION;
const DB_APIurl = process.env.REACT_APP_DB_API_URL;
const OTP_APIurl = process.env.REACT_APP_OTP_API_URL;

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
        DB_APIurl + 'samples?tableName=harm_reduction_samples'
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <br/>
            <Box component='fieldset' sx={{m:1, display: 'flex', alignItems: 'center', borderRadius:1, borderColor: 'text.primary', border: 1, fontSize:10}}>
              <legend>Search Data by</legend>
              <Box sx={{m:1}}>
              <DatePicker
                label="Date Received"
                inputFormat="YYYY-MM-DD"
                value={searchQueryDateReceived}
                onChange={(newValue) => setSearchQueryDateReceived(dayjs(newValue).format('YYYY-MM-DD'))}
                slotProps={{
                  textField: {
                    size: "small",
                    error: false,
                  },
                }}
                sx={{marginLeft:1, marginRight:1}}
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
              </Box>
            </Box>
            <Button variant="contained" onClick={handleSearchClick} style={{ marginLeft: '10px' }}>
              Search
            </Button>
            <Button variant="contained" onClick={handleResetClick} style={{ marginLeft: '10px' }}>
              Reset
            </Button>
          </div>
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 600, maxWidth:1500, m:1}} aria-label="sample table">
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
      </div>
    </LocalizationProvider>
  );
};

export default SampleTable;
