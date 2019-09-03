
import { useReducer } from 'react';
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

const defaultState = {
  renderer: null,
  scene: null,
  camera: null,

  mainMesh: null,
  meshes: [],

  controls: null,
  clock: null,

  isInitialized: false,
};

const INIT_THREE = 'INIT_THREE';
const RESET = 'RESET';
const RESIZE = 'RESIZE';
const ADD_MESH = 'ADD_MESH';
const REMOVE_MESH = 'REMOVE_MESH';

const reducer = (state, action) => {
  console.log(state, action);

  switch (action.type) {
    case INIT_THREE:
      return action.payload
    
    case RESIZE:
      const { width, height } = action.payload;

      state.camera.aspect = width / height;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize( width, height );
      return state;

    case RESET:
      return defaultState;

    case ADD_MESH:
      state.scene.add(action.payload);
      
      return {
        ...state,
        meshes: [...state.meshes, action.payload]
      };

    case REMOVE_MESH:
      const meshToRemove = state.meshes.filter(m => m.geometry.uuid === action.payload);

      state.scene.remove(meshToRemove);
      meshToRemove.geometry.dispose();
      meshToRemove.material.dispose();
      meshToRemove = undefined;

      copyMeshes = Object.assign({}, state.meshes);
      delete copyMeshes[action.payload];

      return {
        ...state,
        meshes: copyMeshes
      };

    default:
      console.log(`Unknown action ${action.type} in Three reducer.`)
      return state;
  }
};

const useThreeReducer = (initialState = defaultState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helpers
  const createSkyBox = imagePrefix => [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_ft.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_bk.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_up.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_dn.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_rt.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`/images/${imagePrefix}_lf.png`), side: THREE.DoubleSide}),
  ];

  const createSun = () => {
    const sun = new THREE.DirectionalLight( 0xffffff );
    sun.position.set( 30, 100, 40 );
    sun.target.position.set( 0, 0, 0 );
    sun.castShadow = true;

    const lightSize = 500;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 500;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -lightSize;
    sun.shadow.camera.right = sun.shadow.camera.top = lightSize;

    sun.shadow.bias = 0.0039;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    return sun;
  };

  // Actions
  const init = size => {
    const {width, height} = size;

    // Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 5000 );

    // Light
    const light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add(light);

    // Sun
    scene.add(createSun());

    // Skybox
    const geometry = new THREE.CubeGeometry( 10000, 10000, 10000);

    const cubeMaterial = createSkyBox('drakeq');

    const cube = new THREE.Mesh(geometry, cubeMaterial);
    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.shadowMap.enabled = true;

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.maxPolarAngle = Math.PI/2; 
    // Clock
    const clock = new THREE.Clock();

    dispatch({ type: INIT_THREE, payload: {
      ...state,
      renderer,
      scene,
      camera,
      controls,
      clock,
      isInitialized: true
    }});
  }

  const resize = size => dispatch({ type: RESIZE, payload: size });

  const reset = () => dispatch({ type: RESET });

  const addMesh = ({
    position = { x: 0, y: 0, z: 0 },
    color = 0x00ff00
  }) => {
    // Create mesh
    // const geometry = new THREE.BoxGeometry( 20, 20, 20 ); 
    // const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    
    const geometry = new THREE.CircleBufferGeometry(5, 32);

    const material = new THREE.MeshBasicMaterial( { color } ); 
    // const material = new THREE.MeshLambertMaterial( { color } );

    const mesh = new THREE.Mesh( geometry, material ); 
    mesh.position.set(position.x, position.x, position.z);

    dispatch({ type: ADD_MESH, payload: mesh });
  }

  const removeMesh = uuid => dispatch({ type: REMOVE_MESH, payload: uuid });

  const getMesh = uuid => state.meshes.filter(m => m.geometry.uuid === uuid );

  // add following camera
  // swicth camera
  // add local mesh
  // add remote meshes
  
  // Returns state and actions
  return [
    state, 
    { 
      init, reset, resize, 
      addMesh, removeMesh, getMesh
    }
  ];
};

export default useThreeReducer;