'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

import {
  Box,
  Chip,
  Stack,
  Button,
  Tooltip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { FiCode, FiEdit3 } from 'react-icons/fi';

import 'react-quill-new/dist/quill.snow.css';
import './styles.css';

// Dynamic import for react-quill-new to avoid SSR issues (React 19 compatible)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      Loading editor...
    </Box>
  ),
});

// Content type options (Rich text and HTML only - no plain text)
const CONTENT_TYPES = {
  richtext: { label: 'Visual', icon: <FiEdit3 size={14} />, description: 'WYSIWYG editor' },
  html: { label: 'HTML', icon: <FiCode size={14} />, description: 'Paste raw HTML code' },
};

// Quill toolbar configuration
const QUILL_MODULES = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  },
  clipboard: {
    matchVisual: false,
  },
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'align',
  'link',
  'blockquote',
  'code-block',
  'color',
  'background',
];

// ----------------------------------------------------------------------

export function RichTextEditor({
  value = '',
  onChange,
  contentType = 'richtext',
  onContentTypeChange,
  variables = [],
  onInsertVariable,
  placeholder = 'Enter content...',
  minHeight = 150,
  disabled = false,
  showContentTypeToggle = true,
  label,
  error,
  helperText,
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue) => {
      setLocalValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handlePlainTextChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      setLocalValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleContentTypeChange = useCallback(
    (event, newType) => {
      if (newType && onContentTypeChange) {
        onContentTypeChange(newType);
      }
    },
    [onContentTypeChange]
  );

  const handleInsertVariable = useCallback(
    (variableKey) => {
      const variableToken = `{{${variableKey}}}`;

      if (contentType === 'html') {
        // For HTML, append to the current value
        const newValue = localValue ? `${localValue} ${variableToken}` : variableToken;
        setLocalValue(newValue);
        if (onChange) {
          onChange(newValue);
        }
      } else {
        // For rich text, insert with styling
        const newValue = localValue
          ? `${localValue}<span class="variable-token">${variableToken}</span>&nbsp;`
          : `<span class="variable-token">${variableToken}</span>&nbsp;`;
        setLocalValue(newValue);
        if (onChange) {
          onChange(newValue);
        }
      }

      if (onInsertVariable) {
        onInsertVariable(variableKey);
      }
    },
    [contentType, localValue, onChange, onInsertVariable]
  );

  // Render variable chips
  const variableChips = useMemo(() => {
    if (!variables || variables.length === 0) return null;
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
        {variables.map((variable) => (
          <Tooltip key={variable.key} title={`Insert {{${variable.key}}}`} arrow>
            <Chip
              size="small"
              label={variable.label || variable.key}
              onClick={() => handleInsertVariable(variable.key)}
              disabled={disabled}
              sx={{
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                bgcolor: 'primary.lighter',
                color: 'primary.dark',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              }}
            />
          </Tooltip>
        ))}
      </Stack>
    );
  }, [variables, handleInsertVariable, disabled]);

  if (!isMounted) {
    return (
      <Box
        sx={{
          height: minHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        Loading editor...
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with label and content type toggle */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        {label && (
          <Box component="span" sx={{ typography: 'subtitle2', color: 'text.primary' }}>
            {label}
          </Box>
        )}
        {showContentTypeToggle && (
          <ToggleButtonGroup
            size="small"
            value={contentType}
            exclusive
            onChange={handleContentTypeChange}
            disabled={disabled}
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
              },
            }}
          >
            {Object.entries(CONTENT_TYPES).map(([type, config]) => (
              <ToggleButton key={type} value={type}>
                <Tooltip title={config.description} arrow>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {config.icon}
                    <span>{config.label}</span>
                  </Stack>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Stack>

      {/* Variable chips */}
      {variableChips}

      {/* Editor based on content type */}
      {contentType === 'richtext' && (
        <Box
          sx={{
            '& .quill': {
              border: error ? '1px solid' : undefined,
              borderColor: error ? 'error.main' : undefined,
              borderRadius: 1,
            },
            '& .ql-container': {
              minHeight: minHeight,
              fontSize: '0.875rem',
            },
            '& .ql-editor': {
              minHeight: minHeight,
            },
            '& .ql-toolbar': {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
            '& .ql-container': {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            },
          }}
        >
          <ReactQuill
            theme="snow"
            value={localValue}
            onChange={handleChange}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            placeholder={placeholder}
            readOnly={disabled}
          />
          {helperText && (
            <Box
              component="span"
              sx={{
                display: 'block',
                mt: 0.5,
                mx: 1.5,
                fontSize: '0.75rem',
                color: error ? 'error.main' : 'text.secondary',
              }}
            >
              {helperText}
            </Box>
          )}
        </Box>
      )}

      {contentType === 'html' && (
        <TextField
          fullWidth
          multiline
          minRows={Math.max(4, Math.floor(minHeight / 20))}
          placeholder={`<p>Enter HTML content here...</p>\n<p>Use {{variable}} for dynamic content.</p>`}
          value={localValue}
          onChange={handlePlainTextChange}
          disabled={disabled}
          error={error}
          helperText={helperText}
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
            },
            '& .MuiInputBase-root': {
              bgcolor: 'grey.900',
              color: 'grey.100',
            },
          }}
        />
      )}

      {/* HTML Preview for HTML mode */}
      {contentType === 'html' && localValue && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              Preview:
            </Box>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                // Copy HTML to clipboard
                navigator.clipboard.writeText(localValue);
              }}
            >
              Copy HTML
            </Button>
          </Stack>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              '& img': { maxWidth: '100%' },
              '& a': { color: 'primary.main' },
            }}
            dangerouslySetInnerHTML={{ __html: localValue }}
          />
        </Box>
      )}
    </Box>
  );
}

export default RichTextEditor;

