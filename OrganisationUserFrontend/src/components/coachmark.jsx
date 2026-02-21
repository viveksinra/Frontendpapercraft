'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { FiX } from 'react-icons/fi';

export function Coachmark({ anchorId, open, title, description, actions = [], onDismiss }) {
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!anchorId || typeof document === 'undefined') return;
    setAnchorEl(document.getElementById(anchorId));
  }, [anchorId]);

  return (
    <Popper
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="top"
      transition
      modifiers={[
        {
          name: 'offset',
          options: { offset: [0, 16] },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <Paper
            elevation={6}
            sx={{
              px: 2.5,
              py: 2,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[8],
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Stack spacing={0.5} sx={{ pr: 1.5 }}>
                <Typography variant="subtitle1">{title}</Typography>
                {description ? (
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                ) : null}
              </Stack>
              <IconButton size="small" aria-label="Dismiss onboarding tip" onClick={onDismiss}>
                <FiX size={16} />
              </IconButton>
            </Stack>
            {actions.length ? (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    size="small"
                    variant={action.variant || 'contained'}
                    color={action.color || 'primary'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            ) : null}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

Coachmark.propTypes = {
  anchorId: PropTypes.string,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
      color: PropTypes.string,
    })
  ),
  onDismiss: PropTypes.func,
};

Coachmark.defaultProps = {
  actions: [],
  onDismiss: () => {},
};




