import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid } from '@fluentui/react-northstar';
import { useSelector, useDispatch } from 'react-redux';

import CameraDetailInfo from '../components/CameraDetails/CameraDetailInfo';
import { CameraConfigureInfoContainer, CreateCameraConfigButton } from '../components/CameraConfigure';
import { getCameras } from '../store/camera/cameraActions';
import { Camera } from '../store/camera/cameraTypes';
import { State } from '../store/State';
import { thunkGetProject } from '../store/project/projectActions';
import { useQuery } from '../hooks/useQuery';
import { AOIData } from '../type';

const CameraDetails: FC = (): JSX.Element => {
  const cameraIdInproject = useSelector<State, number>((state) => state.project.data.camera);
  const projectId = useSelector<State, number>((state) => state.project.data.id);
  const dispatch = useDispatch();
  const name = useQuery().get('name');
  const isDemo = useQuery().get('isDemo');
  const camera = useSelector<State, Camera>((state) => state.cameras.find((ele) => ele.name === name));

  useEffect(() => {
    dispatch(thunkGetProject(isDemo === 'true'));
    dispatch(getCameras());
  }, [dispatch, isDemo]);

  if (!camera) return <Redirect to="/cameras" />;

  const hasProject = cameraIdInproject === camera.id;
  // TODO Get this inside live view container
  const aoiData = getAOIData(camera.area);

  return (
    <Grid columns="2" design={{ height: '100%' }}>
      <CameraDetailInfo id={camera.id} name={name} rtsp={camera.rtsp} AOIs={aoiData} />
      {hasProject ? <CameraConfigureInfoContainer projectId={projectId} /> : <CreateCameraConfigButton />}
    </Grid>
  );
};

export default CameraDetails;

const getAOIData = (cameraArea: string): AOIData => {
  try {
    return JSON.parse(cameraArea);
  } catch (e) {
    return {
      useAOI: false,
      AOIs: [],
    };
  }
};
