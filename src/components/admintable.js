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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Pagination,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import '../css/admintable.css';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';


import axios from 'axios';

const REGION = process.env.REACT_APP_AWS_REGION;
const DB_APIurl = process.env.REACT_APP_DB_API_URL;
const OTP_APIurl = process.env.REACT_APP_OTP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
  },
}));

const SampleTable = () => {
  const [samples, setSamples] = useState([]);
  const [initialSamples, setInitialSamples] = useState([]);
  const [editableRows, setEditableRows] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    location: [],
    color: [],
    testingMethod: [],
    isUsed: [],
  });

  const [searchQuerySampleId, setSearchQuerySampleId] = useState('');
  const [searchQueryExpectedContent, setSearchQueryExpectedContent] = useState('');
  const [searchQueryTestResults, setSearchQueryTestResults] = useState('');

  const [searchQueryDateReceived, setSearchQueryDateReceived] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    status: [],
    location: [],
    color: [],
    testingMethod: [],
    isUsed: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [samplesPerPage] = useState(4);


  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await axios.get(
        DB_APIurl + 'samples?tableName=harm-reduction-samples',
        {
          headers: {
            'x-api-key': API_KEY,
          }
        }

      );
      const data = response.data;

      data.sort((a, b) => new Date(a['date-received']) - new Date(b['date-received']));

      setSamples(data);
      setInitialSamples(data);

      const options = {
        status: Array.from(new Set(data.map((sample) => sample.status))),
        location: Array.from(new Set(data.map((sample) => sample.location))),
        color: Array.from(new Set(data.map((sample) => sample.color))),
        testingMethod: Array.from(new Set(data.map((sample) => sample['testing-method']))),
        isUsed: Array.from(new Set(data.map((sample) => sample['is-used']))),
      };
      setFilterOptions(options);

      // Apply the filters initially
      const filteredSamples = applyFilters(data, filters);
      setSamples(filteredSamples);
    } catch (error) {
      console.error('Error fetching samples:', error);
    }
  };

  const handleEditClick = (sampleId) => {
    setEditableRows((prevEditableRows) => [...prevEditableRows, sampleId]);
  };

  const handleCancelClick = (sampleId) => {
    setSamples((prevSamples) =>
      prevSamples.map((sample) => {
        if (sample['sample-id'] === sampleId) {
          const initialSample = initialSamples.find((s) => s['sample-id'] === sampleId);
          return {
            ...sample,
            ...initialSample,
          };
        }
        return sample;
      })
    );
    setEditableRows((prevEditableRows) => prevEditableRows.filter((id) => id !== sampleId));
  };

  const handleConfirmClick = async (
    sampleId,
    newNote,
    newTestResult,
    newStatus,
    newDateReceived,
    newExpectedContent,
    newIsUsed,
    newLocation,
    newColor,
    newTestingMethod
  ) => {
    try {
      await axios.put(
        DB_APIurl + `samples?tableName=harm-reduction-samples`,
        {
          'sample-id': sampleId,
          notes: newNote,
          'test-results': newTestResult,
          status: newStatus,
          'date-received': newDateReceived,
          'expected-content': newExpectedContent,
          'is-used': newIsUsed,
          location: newLocation,
          color: newColor,
          'testing-method': newTestingMethod,
        },
        {
          headers: {
            'x-api-key': API_KEY,
          }
        }
      );
  
      setInitialSamples((prevInitialSamples) =>
        prevInitialSamples.map((sample) => {
          if (sample['sample-id'] === sampleId) {
            return {
              ...sample,
              notes: newNote,
              'test-results': newTestResult,
              status: newStatus,
              'date-received': newDateReceived,
              'expected-content': newExpectedContent,
              'is-used': newIsUsed,
              location: newLocation,
              color: newColor,
              'testing-method': newTestingMethod,
            };
          }
          return sample;
        })
      );
  
      setEditableRows((prevEditableRows) => prevEditableRows.filter((id) => id !== sampleId));
    } catch (error) {
      console.error('Error updating sample:', error);
    }
  };
  

  const isRowEditable = (sampleId) => editableRows.includes(sampleId);

  const renderCell = (sampleId, attribute, value) => {
    if (isRowEditable(sampleId) && attribute !== "sample-id") {
      return (
        <TableCell>
          <TextField
            value={value}
            onChange={(e) => handleCellChange(sampleId, attribute, e.target.value)}
          />
        </TableCell>
      );
    }
  
    if (attribute === "status" && value === "Manual Testing Required") {
      return (
        <TableCell style={{ backgroundColor: "#ff9800", color: "#fff" }}>{value}</TableCell>
      );
    }
  
    return <TableCell>{value}</TableCell>;
  };
  

  const handleCellChange = (sampleId, attribute, value) => {
    setSamples((prevSamples) =>
      prevSamples.map((sample) => {
        if (sample['sample-id'] === sampleId) {
          return {
            ...sample,
            [attribute]: value,
          };
        }
        return sample;
      })
    );
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuerySampleId(event.target.value);
  };

  const handleExpectedContentChange = (event, sampleId) => {
    const newExpectedContent = event.target.value;
    setSamples((prevSamples) =>
      prevSamples.map((sample) => {
        if (sample['sample-id'] === sampleId) {
          return {
            ...sample,
            'expected-content': newExpectedContent,
          };
        }
        return sample;
      })
    );
  };

  const handleTestResultsChange = (event, sampleId) => {
    const newTestResults = event.target.value;
    setSamples((prevSamples) =>
      prevSamples.map((sample) => {
        if (sample['sample-id'] === sampleId) {
          return {
            ...sample,
            'test-results': newTestResults,
          };
        }
        return sample;
      })
    );
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: Array.isArray(value) ? value : [value],
    }));
  };

  const applyFilters = (data, filters) => {
    const { status, location, color, testingMethod, isUsed } = filters;

    return data.filter((sample) => {
      if (status.length > 0 && !status.includes(sample.status)) {
        return false;
      }
      if (location.length > 0 && !location.includes(sample.location)) {
        return false;
      }
      if (color.length > 0 && !color.includes(sample.color)) {
        return false;
      }
      if (testingMethod.length > 0 && !testingMethod.includes(sample['testing-method'])) {
        return false;
      }
      if (isUsed.length > 0 && !isUsed.includes(sample['is-used'])) {
        return false;
      }
      return true;
    });
  };

  const handleSearchClick = () => {
    const filteredSamples = initialSamples.filter((sample) => {
      return (
        sample['sample-id'].includes(searchQuerySampleId) &&
        sample['expected-content'].includes(searchQueryExpectedContent) &&
        sample['test-results'].includes(searchQueryTestResults) &&
        (searchQueryDateReceived === '' ||
          sample['date-received'].includes(searchQueryDateReceived))
      );
    });
  
    const filteredAndAppliedSamples = applyFilters(filteredSamples, filters);
    setSamples(filteredAndAppliedSamples);
    setCurrentPage(1); // Reset to the first page
  };
  
  

  const handleResetClick = () => {
    setSamples(initialSamples);
    setSearchQuerySampleId('');
    setSearchQueryExpectedContent('');
    setSearchQueryTestResults('');
    setSearchQueryDateReceived(''); 
    setFilters({
      status: [],
      location: [],
      color: [],
      testingMethod: [],
      isUsed: [],
    });
  };
  

  const indexOfLastSample = currentPage * samplesPerPage;
  const indexOfFirstSample = indexOfLastSample - samplesPerPage;
  const currentSamples = samples.slice(indexOfFirstSample, indexOfLastSample);

  const totalPages = Math.ceil(samples.length / samplesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '16px'}}>
        <Box component='fieldset' sx={{m:1, display: 'flex', alignItems: 'center', borderRadius:1, borderColor: 'text.primary', border: 1, fontSize:10 }}>
          <legend> Filter Data </legend>
          <FormControl sx={{m:1, minWidth: 120, fontSize:12 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={filters.status}
              onChange={handleFilterChange}
              name="status"
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.status.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.status.includes(status)} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Location</InputLabel>
            <Select
              multiple
              value={filters.location}
              onChange={handleFilterChange}
              name="location"
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.location.map((location) => (
                <MenuItem key={location} value={location}>
                  <Checkbox checked={filters.location.includes(location)} />
                  <ListItemText primary={location} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Color</InputLabel>
            <Select
              multiple
              value={filters.color}
              onChange={handleFilterChange}
              name="color"
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.color.map((color) => (
                <MenuItem key={color} value={color}>
                  <Checkbox checked={filters.color.includes(color)} />
                  <ListItemText primary={color} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel>Testing Method</InputLabel>
            <Select
              multiple
              value={filters.testingMethod}
              onChange={handleFilterChange}
              name="testingMethod"
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.testingMethod.map((testingMethod) => (
                <MenuItem key={testingMethod} value={testingMethod}>
                  <Checkbox checked={filters.testingMethod.includes(testingMethod)} />
                  <ListItemText primary={testingMethod} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Is Used</InputLabel>
            <Select
              multiple
              value={filters.isUsed}
              onChange={handleFilterChange}
              name="isUsed"
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.isUsed.map((isUsed) => (
                <MenuItem key={isUsed} value={isUsed}>
                  <Checkbox checked={filters.isUsed.includes(isUsed)} />
                  <ListItemText primary={isUsed} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box component='fieldset' sx={{m:1, display: 'flex', alignItems: 'center', borderRadius:1, borderColor: 'text.primary', border: 1, fontSize:10}}>
          <legend>Search Data by</legend>
          <TextField
            label="Sample ID"
            variant="outlined"
            size="small"
            value={searchQuerySampleId}
            onChange={handleSearchQueryChange}
            sx={{m:1, marginRight: '8px' }}
          />
          <TextField
            label="Expected Content"
            variant="outlined"
            size="small"
            value={searchQueryExpectedContent}
            onChange={(e) => setSearchQueryExpectedContent(e.target.value)}
            sx={{m:1, marginRight: '8px' }}
          />
          <TextField
            label="Test Results"
            variant="outlined"
            size="small"
            value={searchQueryTestResults}
            onChange={(e) => setSearchQueryTestResults(e.target.value)}
            sx={{m:1, marginRight: '8px' }}
          />
          <DatePicker
            label="Date Received"
            inputFormat="MM/DD/YYYY"
            value={searchQueryDateReceived}
            onChange={(newValue) => setSearchQueryDateReceived(dayjs(newValue).format('YYYY-MM-DD'))}
            slotProps={{
              textField: {
                size: "small",
                error: false,
              },
            }}
          />
        </Box>
        <Box sx = {{m:1,}}>
          <Button variant="contained" onClick={handleSearchClick} sx = {{marginRight: '5px'}}>
            Search
          </Button>
          <Button variant="contained" onClick={handleResetClick}>
            Reset
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200, maxWidth: 1200 }} aria-label="sample table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Sample ID</StyledTableCell>
              <StyledTableCell>Expected Content</StyledTableCell>
              <StyledTableCell>Test Results</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Date Received</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
              <StyledTableCell>Is Used</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Color</StyledTableCell>
              <StyledTableCell>Testing Method</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentSamples.map((sample) => (
              <TableRow key={sample['sample-id']}>
                {renderCell(sample['sample-id'], 'sample-id', sample['sample-id'])}
                {renderCell(sample['sample-id'], 'expected-content', sample['expected-content'])}
                {renderCell(sample['sample-id'], 'test-results', sample['test-results'])}
                {renderCell(sample['sample-id'], 'status', sample.status)}
                {renderCell(sample['sample-id'], 'date-received', sample['date-received'])}
                {renderCell(sample['sample-id'], 'notes', sample.notes)}
                {renderCell(sample['sample-id'], 'is-used', sample['is-used'])}
                {renderCell(sample['sample-id'], 'location', sample.location)}
                {renderCell(sample['sample-id'], 'color', sample.color)}
                {renderCell(sample['sample-id'], 'testing-method', sample['testing-method'])}
                <StyledTableCell>
                  {isRowEditable(sample['sample-id']) ? (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleConfirmClick(
                            sample['sample-id'],
                            sample.notes,
                            sample['test-results'],
                            sample.status,
                            sample['date-received'],
                            sample['expected-content'],
                            sample['is-used'],
                            sample.location,
                            sample.color,
                            sample['testing-method']
                          )
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color='error'
                        onClick={() => handleCancelClick(sample['sample-id'])}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(sample['sample-id'])}
                    >
                      Edit
                    </Button>
                  )}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} sx={{m:1}}/>

    </div>
    </LocalizationProvider>
  );
};

export default SampleTable;
