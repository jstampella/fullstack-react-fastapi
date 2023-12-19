import { Fragment, ReactNode, useState } from 'react';
import { SxProps, Theme, styled, useTheme } from '@mui/material/styles';
import Table, { TablePropsSizeOverrides } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, CircularProgress, Collapse, IconButton, Typography } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { MdKeyboardDoubleArrowUp, MdKeyboardDoubleArrowDown } from "react-icons/md";
import { hexToRgba } from '../utils/common';

interface StyledTableCellProps extends TableCellProps {
  theme?: Theme;
  type?: 'primary' | 'secondary';
}
// Define styles for the TableCell component
const StyledTableCell = styled(TableCell)<StyledTableCellProps>(({ theme, type }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: type === 'primary' ? theme.palette.primary.main : theme.palette.text.disabled,
    color: type === 'primary' ? theme.palette.background.default : theme.palette.background.paper,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.background.paper,
  },
}));

// Define styles for TableRow component
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.MuiTableRow-hover:hover':{
    backgroundColor: theme.palette.background.paper,
    '& th, td':{
    color: theme.palette.primary.light}
    
  },
  '& th, td': {
    borderBottom: `1px solid ${theme.palette.text.primary}`,
  },
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.text.secondary,
  },
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.text.secondary,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.light,
    cursor: 'pointer',
  },
  [`&.Mui-selected:hover > .${tableCellClasses.body}`]: {
    color: theme.palette.primary.main,
  },
}));

const styleDiv = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 1,
  fontSize: '38px',
  color: 'primary.main',
};

interface rowProps<T> {
  row: T;
  handdleClick?: (row: T) => void;
  headers: IHeaders<T>[];
  extraHeaders?: IHeaders<T>[];
  sxRows: SxProps<Theme> | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Row = <T extends { [key: string]: any }>(props: rowProps<T>) => {
  const { row, handdleClick, headers, extraHeaders, sxRows } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <StyledTableRow
        sx={sxRows}
        selected={!!handdleClick}
        onClick={() => handdleClick && handdleClick(row)}
        hover
      >
        {extraHeaders && (
          <TableCell style={{ width: '15px', padding: 0 }}>
            <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
              {open ? <MdKeyboardDoubleArrowUp /> : <MdKeyboardDoubleArrowDown />}
            </IconButton>
          </TableCell>
        )}

        {headers.map((head, index) => {
          let cellContent: JSX.Element | ReactNode = <Box>n/n</Box>;
          if (Object.prototype.hasOwnProperty.call(row, head.id)) {
            if (head.action) {
              cellContent = (
                <IconButton
                  color='inherit'
                  sx={{ ':hover': { color: 'background.default' } }}
                  onClick={() => head.action && head.action(row)}
                >
                  {head.custom ? head.custom(row[head.id]) : row[head.id]}
                </IconButton>
              );
            } else if (head.custom) {
              cellContent = head.custom(row[head.id]);
            } else if (Array.isArray(row[head.id])) {
              cellContent = '[' + row[head.id].join(',') + ']';
            } else if (typeof row[head.id] === 'object' && row[head.id] !== null) {
              cellContent = '!error';
            } else {
              cellContent = row[head.id] as ReactNode;
            }
          } else if (['delete', 'edit', 'view'].includes(head.id.toString())) {
            cellContent = (
              <IconButton
                color='inherit'
                sx={{ ':hover': { color: 'background.default' } }}
                onClick={() => head.action && head.action(row)}
              >
                {head.custom ? head.custom(row[head.id]) : head.display}
              </IconButton>
            );
          }

          return (
            <StyledTableCell
              type='primary'
              component={index === 0 ? 'th' : 'td'}
              scope='row'
              key={index + 'cell'}
              align='center'
            >
              {cellContent}
            </StyledTableCell>
          );
        })}
      </StyledTableRow>
      {extraHeaders && (
        <StyledTableRow>
          <StyledTableCell type='primary' style={{ padding: 0 }} colSpan={headers.length + 1}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box>
                <Table stickyHeader aria-label='customized table' sx={{ overflow: 'auto' }}>
                  <TableHead>
                    <TableRow>
                      {extraHeaders.map((item, index) => (
                        <StyledTableCell
                          type='secondary'
                          style={{
                            width: ['delete', 'edit', 'view'].includes(item.id.toString())
                              ? '30px'
                              : 'auto',
                          }}
                          sx={{
                            textAlign: 'center',
                            ...item.sx,
                          }}
                          key={item.id.toString() + index}
                        >
                          {item.display}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ position: 'relative' }}>
                    <StyledTableRow>
                      {extraHeaders.map((head, index) =>
                        Object.prototype.hasOwnProperty.call(row, head.id) ? (
                          <StyledTableCell
                            type='secondary'
                            component={index === 0 ? 'th' : 'td'}
                            scope='row'
                            key={index + 'cell'}
                            align='center'
                          >
                            {Array.isArray(row[head.id])
                              ? '[' + row[head.id].join(',') + ']'
                              : (row[head.id] as ReactNode)}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell
                            type='secondary'
                            component={index === 0 ? 'th' : 'td'}
                            scope='row'
                            key={index + 'cell'}
                            align='center'
                          >
                            {['delete', 'edit', 'view'].includes(head.id.toString()) ? (
                              <IconButton
                                color='inherit'
                                sx={{ ':hover': { color: 'background.default' } }}
                                onClick={() => head.action && head.action(row)}
                              >
                                {head.display}
                              </IconButton>
                            ) : (
                              'n/n'
                            )}
                          </StyledTableCell>
                        )
                      )}
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </StyledTableCell>
        </StyledTableRow>
      )}
    </Fragment>
  );
};

export interface ISxRows<T> {
  column: keyof T;
  value: T[keyof T];
  sx: SxProps<Theme> | undefined;
}

type HandlleClick<T> = (row: T) => void;

export interface IHeaders<T, A = HandlleClick<T>> {
  id: keyof T;
  display: string | ReactNode;
  action?: A;
  custom?: (value: T[keyof T]) => React.ReactNode | T[keyof T];
  width?: string | number | undefined;
  sx?: SxProps<Theme> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface IProps<T> {
  headers: IHeaders<T>[];
  extraHeaders?: IHeaders<T>[];
  rows: T[];
  onClickRow?: HandlleClick<T>;
  sx?: SxProps;
  sxRows?: ISxRows<T>[];
  size?: OverridableStringUnion<'small' | 'medium', TablePropsSizeOverrides> | undefined;
  isLoading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const CustomizedTables = <T extends { [key: string]: any }>({
  headers,
  extraHeaders,
  rows,
  onClickRow,
  isLoading,
  sx,
  sxRows,
  size,
}: IProps<T>): JSX.Element => {
  const isTheme = useTheme();

  return (
    <>
      <TableContainer sx={{ position: 'relative', ...sx }}>
        <Table size={size} stickyHeader aria-label='customized table' sx={{ overflow: 'auto' }}>
          <TableHead>
            <TableRow>
              {extraHeaders && <StyledTableCell type='primary' style={{ width: '15px' }} />}
              {headers.map((item, index) => (
                <StyledTableCell
                  type='primary'
                  style={{
                    width: ['delete', 'edit', 'view'].includes(item.id.toString())
                      ? '30px'
                      : item.width ?? 'auto',
                  }}
                  sx={{
                    textAlign: 'center',
                    ...item.sx,
                  }}
                  key={item.id.toString() + index}
                >
                  {item.display}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ position: 'relative' }}>
            {Array.isArray(rows) ? (
              rows.map((row, index) => (
                <Row<T>
                  sxRows={
                    sxRows &&
                    sxRows.reverse().find((e: ISxRows<T>) => {
                      return row[e.column] === e.value;
                    })?.sx
                  }
                  handdleClick={onClickRow}
                  key={index + 'row'}
                  row={row}
                  headers={headers}
                  extraHeaders={extraHeaders}
                />
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell
                  type='primary'
                  colSpan={extraHeaders ? headers.length + 1 : headers.length}
                  align='center'
                >
                  <Box
                    sx={{
                      ...styleDiv,
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>Error en la consulta</Typography>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
            {rows.length === 0 && isLoading && (
              <StyledTableRow>
                <StyledTableCell
                  type='primary'
                  colSpan={extraHeaders ? headers.length + 1 : headers.length}
                  align='center'
                >
                  <Box
                    sx={{
                      fontSize: '38px',
                      color: 'primary.main',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress color='warning' />
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
            {rows.length === 0 && !isLoading && (
              <StyledTableRow>
                <StyledTableCell
                  type='primary'
                  colSpan={extraHeaders ? headers.length + 1 : headers.length}
                  align='center'
                >
                  <Box sx={{ ...styleDiv }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Sin datos</Typography>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
            {rows.length > 0 && isLoading && (
              <StyledTableRow
                sx={{ position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px' }}
                style={{ backgroundColor: 'transparent' }}
              >
                <StyledTableCell
                  type='primary'
                  colSpan={extraHeaders ? headers.length + 1 : headers.length}
                  align='center'
                  sx={{
                    padding: 0,
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    right: '0px',
                    bottom: '0px',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      fontSize: '38px',
                      color: 'primary.main',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: hexToRgba(isTheme.palette.background.paper, 0.4),
                    }}
                  >
                    <CircularProgress color='warning' size={38} />
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomizedTables;
