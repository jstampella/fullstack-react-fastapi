import { ReactNode } from 'react';
import { SxProps, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, IconButton } from '@mui/material';
import { AiOutlineLoading } from 'react-icons/ai';

// Define styles for the TableCell component
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.background.paper,
  },
}));

// Define styles for TableRow component
const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

type HandlleClick<T> = (row: T) => void;

export interface IHeaders<T> {
  id: string;
  display: string | ReactNode;
  action?: HandlleClick<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface IProps<T> {
  headers: IHeaders<T>[];
  rows: T[];
  onClickRow?: HandlleClick<T>;
  sx?: SxProps;
  isLoading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const CustomizedTables = <T extends { [key: string]: any }>({
  headers,
  rows,
  onClickRow,
  isLoading,
  sx,
}: IProps<T>): JSX.Element => {
  const handdleClick: HandlleClick<T> = (row) => {
    if (onClickRow) onClickRow(row);
  };
  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label='customized table' sx={{ overflow: 'auto', ...sx }}>
          <TableHead>
            <TableRow>
              {headers.map((item, index) => (
                <StyledTableCell
                  sx={{
                    textAlign: 'center',
                    width: item.id === 'delete' || item.id === 'edit' ? '30px' : undefined,
                    // minWidth: index === 0 ? '200px' : 0,
                  }}
                  key={item.id + index}
                >
                  {item.display}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align='center'>
                  <Box sx={{ fontSize: '38px', color: 'primary.main' }}>
                    <AiOutlineLoading className='spinner' />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                // Remove sx prop as it is no longer needed
                <StyledTableRow
                  selected
                  key={index + 'row'}
                  onClick={() => handdleClick(row)}
                  hover
                >
                  {headers.map((head, index) =>
                    Object.prototype.hasOwnProperty.call(row, head.id) ? (
                      <StyledTableCell
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
                        component={index === 0 ? 'th' : 'td'}
                        scope='row'
                        key={index + 'cell'}
                        align='center'
                      >
                        {head.id === 'delete' || head.id === 'edit' ? (
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomizedTables;
