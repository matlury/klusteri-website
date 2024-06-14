import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';

export default function OrgSelect({data, value, handleChange}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{t("reservations_org")}</InputLabel>
        <Select
          id="organizerName"
          value={value}
          label="Järjestäjä"
          onChange={handleChange}
        >
          {data.map((organization) => (
            <MenuItem key={organization} value={organization.id}>
            {organization.name}
          </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}