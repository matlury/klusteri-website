import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function OrgSelect({data}) {
  const [org, setOrg] = React.useState('');

  const handleChange = (event) => {
    setOrg(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Järjestö</InputLabel>
        <Select
          labelId="organization-select-label"
          id="organization-simple-select"
          value={org}
          label="Järjestö"
          onChange={handleChange}
        >
          {data.map((organization) => (
            <MenuItem value={organization}>{organization.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}