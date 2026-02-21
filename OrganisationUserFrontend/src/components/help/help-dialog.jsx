'use client';

import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { FiHelpCircle, FiX } from 'react-icons/fi';

import { RouterLink } from 'src/routes/components';

const DRAWER_PLACEMENT = Object.freeze({
  desktop: 'right',
  mobile: 'bottom',
});

/**
 * Usage:
 *
 * <Label>
 *   SEO Coach
 *   <HelpDialog title="SEO Coach" subtitle="QA before publish">
 *     <Typography variant="body2">
 *       Explain how coach verifies drafts, required fields, etc.
 *     </Typography>
 *   </HelpDialog>
 * </Label>
 */
export function HelpDialog({
  title,
  subtitle,
  children,
  actions,
  iconSize,
  tooltip,
  placement,
  triggerSx,
  iconColor,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  renderTrigger,
  ariaLabel,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = typeof controlledOpen === 'boolean';
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const resolvedPlacement = useMemo(
    () => ({
      ...DRAWER_PLACEMENT,
      ...(placement || {}),
    }),
    [placement],
  );

  const anchor = isDesktop ? resolvedPlacement.desktop : resolvedPlacement.mobile;

  const handleOpenChange = useCallback(
    (next) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const triggerNode = useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({ open, setOpen: handleOpenChange });
    }

    const tooltipLabel = tooltip || 'What does this do?';

    return (
      <Tooltip title={tooltipLabel} arrow placement="top">
        <IconButton
          size="small"
          onClick={() => handleOpenChange(true)}
          aria-label={ariaLabel}
          sx={{
            p: 0.5,
            color: iconColor || 'text.secondary',
            transition: theme.transitions.create('color'),
            '&:hover': { color: iconColor || theme.palette.text.primary },
            ...triggerSx,
          }}
        >
          <FiHelpCircle size={iconSize} />
        </IconButton>
      </Tooltip>
    );
  }, [ariaLabel, handleOpenChange, iconColor, iconSize, renderTrigger, theme.transitions, tooltip, triggerSx, open]);

  const renderActionButton = useCallback((action) => {
    const {
      key,
      label: actionLabel,
      variant = 'contained',
      color = 'primary',
      onClick,
      href,
      target,
      component,
      closeOnClick = true,
      startIcon,
      endIcon,
      disabled,
    } = action;

    const handleClick = (event) => {
      onClick?.(event, { close: () => handleOpenChange(false) });
      if (!event?.defaultPrevented && closeOnClick) {
        handleOpenChange(false);
      }
    };

    const buttonProps = {
      key: key || actionLabel,
      variant,
      color,
      disabled,
      startIcon,
      endIcon,
      onClick: handleClick,
    };

    if (href) {
      buttonProps.component = component || RouterLink;
      buttonProps.href = href;
      buttonProps.target = target;
      if (target === '_blank') {
        buttonProps.rel = 'noopener noreferrer';
      }
    } else if (component) {
      buttonProps.component = component;
    }

    return (
      <Button {...buttonProps}>
        {actionLabel}
      </Button>
    );
  }, [handleOpenChange]);

  return (
    <Box component="span">
      {triggerNode}

      {/*
        Drawer gives us focus trapping + a11y for both desktop (slide in from right)
        and mobile (sheet from bottom). Content lives inside semantic <section>.
      */}
      <Drawer
        anchor={anchor}
        open={open}
        onClose={() => handleOpenChange(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          component: 'section',
          'aria-label': title || 'Feature help dialog',
          sx: {
            width: isDesktop ? 440 : '100%',
            maxWidth: '100%',
            height: isDesktop ? '100%' : 'min(90vh, 640px)',
            borderTopLeftRadius: anchor === 'right' || anchor === 'bottom' ? 16 : 0,
            borderTopRightRadius: anchor === 'bottom' ? 16 : 0,
            borderBottomLeftRadius: anchor === 'right' ? 16 : 0,
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <IconButton onClick={() => handleOpenChange(false)} aria-label="Close help dialog" size="small">
            <FiX size={18} />
          </IconButton>
        </Stack>

        <Divider />

        <Box
          component="div"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pr: 0.5,
          }}
        >
          {children}
        </Box>

        {!!actions?.length && (
          <>
            <Divider />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent={{ xs: 'stretch', sm: 'flex-end' }}
              alignItems="stretch"
            >
              {actions.map((action) => renderActionButton(action))}
            </Stack>
          </>
        )}
      </Drawer>
    </Box>
  );
}

const actionShape = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  component: PropTypes.elementType,
  closeOnClick: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
});

HelpDialog.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.arrayOf(actionShape),
  iconSize: PropTypes.number,
  tooltip: PropTypes.string,
  placement: PropTypes.shape({
    desktop: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    mobile: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  }),
  triggerSx: PropTypes.object,
  iconColor: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  renderTrigger: PropTypes.func,
  ariaLabel: PropTypes.string,
};

HelpDialog.defaultProps = {
  title: '',
  subtitle: '',
  children: null,
  actions: [],
  iconSize: 18,
  tooltip: '',
  placement: DRAWER_PLACEMENT,
  triggerSx: {},
  iconColor: undefined,
  open: undefined,
  defaultOpen: false,
  onOpenChange: undefined,
  renderTrigger: undefined,
  ariaLabel: 'Open contextual help',
};


