import { Box, Typography } from '@mui/material';
import CardNotebook from '../components/CardNotebook';
import { useEffect, useState } from 'react';
import { INotebook } from '../interfaces';
import { AiOutlineLoading } from 'react-icons/ai';
import { useNotebookStore } from '../hooks';

export const HomePage = (): JSX.Element => {
  const { getNotebookByUser } = useNotebookStore();
  const [recordsList, setRecordsList] = useState<INotebook[] | undefined>(undefined);

  const records = async () => {
    const list = await getNotebookByUser();
    setRecordsList(list);
  };
  useEffect(() => {
    records();
  }, []);

  return (
    <Box margin={2} flexDirection={'column'}>
      <Typography variant='h2'>Tus ultimos registros</Typography>
      <Box display='flex' gap={2} justifyContent={'center'} sx={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {recordsList ? (
          recordsList.length > 0 ? (
            recordsList.map((item) => (
              <CardNotebook
                {...item}
                url={`/add-notebook/${item.id}`}
                key={item.id}
              />
            ))
          ) : (
            <Box sx={{ p: 3, m: 2, backgroundColor: 'primary.main', color: 'background.default' }}>
              Aun no tienes notebook registradas!
            </Box>
          )
        ) : (
          <Box sx={{ fontSize: '38px', color: 'primary.main', justifyContent: 'center' }}>
            <AiOutlineLoading className='spinner' />
          </Box>
        )}
      </Box>
    </Box>
  );
};
