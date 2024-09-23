export const mockMapState = {
  currentMapId: 'current_map_id',
  currentMapMarkers: [
    { 
        _id: 'selected_skid_id',
        info: {
            crews: ['crew_id_1'],
            cutPlans: {
                fileName: 'Cut Plan',
                url: 'cut_plan_url',
                key: 'cut_plan_key',
            },
            pointName: 'One',
            selectedDocuments: ['library_file_id_1'],
            siteHazards: ['hazard_id_1']
        }, 
        point: {
            originalHeight: 420,
            originalWidth: 420,
            x: 100,
            y: 150
        }
    }
],
  hazards: [
    {
      _id: 'hazard_id_1',
      id: 'H1',
      title: 'Hazard 1',
      sev: 'HIGH',
      cat: 'Category 1',
      color: '#FF0000',
      searchText: 'hazard1'
    },
    {
      _id: 'hazard_id_2',
      id: 'H2',
      title: 'Hazard 2',
      sev: 'LOW',
      cat: 'Category 2',
      color: '#00FF00',
      searchText: 'hazard2'
    }
  ]
};

export const mockLibraryFiles = {
  types: [
    {
      _id: 'library_file_type_id_1',
      _account: 2,
      name: 'Library Doc Type One',
      note: ''
    },
    {
      _id: 'library_file_type_id_2',
      _account: 2,
      name: 'Library Doc Type Two',
      note: ''
    }
  ],
  files: [
    {
      _id: 'library_file_id_1',
      _account: 2,
      fileName: 'Lib File One',
      fileUrl: 'fileUrl_1',
      key: 'key_1',
      owner: 2,
      searchText: 'searchText_1',
      type: 'library_file_type_id_1'
    },
    {
      _id: 'library_file_id_2',
      _account: 2,
      fileName: 'Lib File Two',
      fileUrl: 'fileUrl_2',
      key: 'key_2',
      owner: 2,
      searchText: 'searchText_2',
      type: 'library_file_type_id_1'
    }
  ]
};

export const mockPersonFiles = {
  personFileTypes: [
    {
      _id: 'person_file_type_id_1',
      _account: 2,
      name: 'Person file type one',
      note: ''
    },
    {
      _id: 'person_file_type_id_2',
      _account: 2,
      name: 'Person file type two',
      note: ''
    }
  ],
  personFiles: [
    {
      _id: 'person_file_id_1',
      _account: 2,
      fileName: 'Person File One',
      type: 'person_file_type_id_1',
      owner: 'person_id_1',
      uri: 'uri_1',
      searchText: 'searchText_1'
    },
    {
      _id: 'person_file_id_2',
      _account: 2,
      fileName: 'Person File Two',
      type: 'person_file_type_id_2',
      owner: 'person_id_1',
      uri: 'uri_2',
      searchText: 'searchText_2'
    }
  ]
};

export const mockSkidState = {
  selectedSkidId: 'selected_skid_id',
  selectedSkidPos: { x: 366, y: 147 },
  formik: {
    values: {
      skidName: 'One',
      selectedCrew: ['crew_id_1'],
      selectedCutPlan: { fileName: 'Cut Plan!', key: 'cutplan_key', url: 'cutplan_url' },
      selectedDocuments: ['library_file_id_1'],
      selectedSkidHazards: ['hazard_id_1']
    }
  }
};

export const mockCrewsState = [
  {
    _id: 'crew_id_1',
    _account: 2,
    name: 'Crew One'
  },
  {
    _id: 'crew_id_2',
    _account: 2,
    name: 'Crew Two'
  }
];
