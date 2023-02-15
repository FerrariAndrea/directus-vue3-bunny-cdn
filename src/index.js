import InterfaceComponent from './interface.vue';

export default {
	id: 'Bunny-upload',
	name: 'Bunny Upload',
	description: 'Interface to receive images and send to Bunny!',
	icon: 'box',
	component: InterfaceComponent,
	types: ['string'],
	options: [
		{
			field: 'folder',
			name: 'Folder',
			meta: {
				width: 'full',
				interface: 'text-input',
				options: {
					placeholder: 'folder (without start/end slash)',
				},
			},
		},
		{
			field: 'collection_as_subfolder',
			name: 'Include collection name as subfolder',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: true,
			},
		}
	]
}