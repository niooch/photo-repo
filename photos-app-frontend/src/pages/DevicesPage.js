// src/pages/DevicesPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button, TextField, Card, CardContent, Typography, Grid } from '@mui/material';

function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');

  const fetchDevices = async () => {
    try {
      const response = await axiosInstance.get('/devices');
      setDevices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDevice = async () => {
    try {
      await axiosInstance.post('/devices', {
        device_name: deviceName,
        device_type: deviceType
      });
      setDeviceName('');
      setDeviceType('');
      fetchDevices(); // odśwież listę
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Devices
      </Typography>

      <div style={{ marginBottom: 20 }}>
        <TextField
          label="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Device Type"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <Button variant="contained" onClick={handleCreateDevice}>
          Create Device
        </Button>
      </div>

      <Grid container spacing={2}>
        {devices.map(device => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={device.device_id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {device.device_name}
                </Typography>
                <Typography variant="body2">
                  Type: {device.device_type}
                </Typography>
                {/* tu ewentualnie przyciski: Edit / Delete */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default DevicesPage;
