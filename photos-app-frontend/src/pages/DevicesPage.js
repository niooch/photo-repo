// src/pages/DevicesPage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [error, setError] = useState('');

  // Tablica dostępnych opcji dla typu urządzenia
  const deviceTypes = ['kamera', 'aparat', 'smartfon', 'inny'];

  const fetchDevices = async () => {
    try {
      const res = await axiosInstance.get('/devices');
      setDevices(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch devices');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleCreateDevice = async () => {
    if (!deviceName.trim() || !deviceType) return;
    try {
      await axiosInstance.post('/devices', { device_name: deviceName, device_type: deviceType });
      setDeviceName('');
      setDeviceType('');
      fetchDevices();
    } catch (err) {
      console.error(err);
      setError('Failed to create device');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Urządzenia</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Nazwa urządzenia"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="device-type-select-label">Typ urządzenia</InputLabel>
          <Select
            labelId="device-type-select-label"
            value={deviceType}
            label="Typ urządzenia"
            onChange={(e) => setDeviceType(e.target.value)}
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCreateDevice}>Utwórz urządzenie</Button>
      </Box>
      <Grid container spacing={2}>
        {devices.map(device => (
          <Grid item xs={12} sm={6} md={4} key={device.device_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{device.device_name}</Typography>
                <Typography variant="body2">Typ: {device.device_type}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DevicesPage;
