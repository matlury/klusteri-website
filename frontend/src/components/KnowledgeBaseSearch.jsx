import React, { useState, useMemo } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

/**
 * A searchable component for rules and instructions.
 * Scans through translation keys to find matching content.
 */
const KnowledgeBaseSearch = ({ onResultClick }) => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  // Build the index of searchable rules
  const rulesIndex = useMemo(() => {
    const index = [];
    for (let i = 1; i <= 118; i++) {
      const key = `rules_${i}`;
      const text = t(key);

      if (text && text !== key) {
        const sectionMatch = text.match(/(\d+)§/);
        const sectionNum = sectionMatch ? sectionMatch[1] : null;

        index.push({
          id: i,
          key: key,
          text: text,
          sectionNum: sectionNum,
          isSection: text.includes('§') || text.length < 40,
          // Pre-compute searchable terms for better matching
          searchTerms: sectionNum ? `sääntö ${sectionNum} pykälä ${sectionNum}` : `sääntö ${i}`
        });
      }
    }
    return index;
  }, [t, i18n.language]);

  return (
    <Box sx={{ mb: 4 }}>
      <Autocomplete
        id="rules-search"
        freeSolo
        options={rulesIndex}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.text}
        // Use ID for equality check to handle identical rule texts
        isOptionEqualToValue={(option, value) => option.id === value.id}
        inputValue={inputValue}
        value={null}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === 'input') {
            setInputValue(newInputValue);
          } else if (reason === 'clear') {
            setInputValue("");
          }
        }}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            onResultClick(newValue);
          }
        }}
        filterOptions={(options, { inputValue }) => {
          const lowerInput = inputValue.toLowerCase();
          return options.filter(option =>
            option.text.toLowerCase().includes(lowerInput) ||
            option.searchTerms.toLowerCase().includes(lowerInput) ||
            option.id.toString() === lowerInput
          );
        }}
        blurOnSelect
        clearOnBlur={false}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("search_rules") || "Hae säännöistä..."}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'background.paper' }
            }}
          />
        )}
        renderOption={(props, option) => {
          const { ...otherProps } = props;
          return (
            <li key={option.key} {...otherProps}>
              <Box sx={{ py: 0.5, width: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: option.isSection ? 'primary.main' : 'text.primary' }}>
                  {option.sectionNum ? `Sääntö ${option.text}` : `Sääntö #${option.id}`}
                </Typography>
                {!option.isSection && (
                  <Typography variant="body2" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: 'text.secondary',
                    fontSize: '0.8rem'
                  }}>
                    {option.text}
                  </Typography>
                )}
              </Box>
            </li>
          );
        }}
      />
    </Box>
  );
};

export default KnowledgeBaseSearch;
