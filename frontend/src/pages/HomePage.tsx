import { Box, Typography } from '@mui/material';
import CardClient from '../components/CardClient';
import { useEffect, useState } from 'react';
import { useClientStore } from '../hooks/useClientStore';
import { IClient } from '../interfaces';
import { AiOutlineLoading } from 'react-icons/ai';

export const HomePage = (): JSX.Element => {
  const { getClientByUser } = useClientStore();
  const [recordsList, setRecordsList] = useState<IClient[] | undefined>(undefined);

  const records = async () => {
    const list = await getClientByUser();
    setRecordsList(list);
  };
  useEffect(() => {
    records();
  }, []);

  return (
    <Box margin={2} flexDirection={'column'}>
      <Typography variant='h2'>Tus ultimos registros</Typography>
      <Box display='flex' gap={2} justifyContent={'center'}>
        {recordsList ? (
          recordsList.length > 0 ? (
            recordsList.map((item) => (
              <CardClient
                apellido={item.apellido}
                dni={item.dni.toString()}
                nombre={item.nombre}
                url={`/add-client/${item._id}`}
                key={item._id}
              />
            ))
          ) : (
            <Box sx={{ p: 3, m: 2, backgroundColor: 'primary.main', color: 'background.default' }}>
              Aun no tienes clientes registrados!
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
