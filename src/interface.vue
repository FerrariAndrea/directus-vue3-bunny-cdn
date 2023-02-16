<template>
  <div id="bunny-upload-dropzone">
    <div class="loader" v-if="uploadProgress">
      <div>Please wait, upload in progress</div>
    </div>
    <div v-bind="getRootProps()" class="draggable-zone" :class="{ 'is-dragged': isDragActive }" :style="{
      backgroundImage:`url(${previewUrl})`
    }">
      <input v-bind="getInputProps()"/>
    </div>
  </div>
</template>

<script>
import {useDropzone} from "vue3-dropzone";
import {inject, onMounted, ref, watchEffect} from "vue";
import * as sha from "js-sha1";
import axios from 'axios'

export default {
  name: "UseDropzoneDemo",
  props: {
    folder : {
      type: String,
      default: '',
    },
    collection_as_subfolder: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: null,
    },
    collection: {
      type: String,
      default: null,
    },
  },
  setup(props, {emit}) {

    const apiUrl = ref('__CDN_API_URL__');
    const apiKey = ref('__CDN_API_KEY__');

    const previewUrl = ref('')
    const uploadProgress = ref(false)
    const values = inject('values')

    let folder = props.folder ? `${props.folder}` : ''
    if (props.collection_as_subfolder) {
      folder = `${folder}${props.collection}`
    }

    const toggleProgress = () => uploadProgress.value = !uploadProgress.value;
    /**
     * @param url
     * @returns {Promise<Blob>}
     */
    const fetchImage = async (url) => await fetch(url).then(r => r.blob());

    /**
     * @param blob
     * @returns {Promise<unknown>}
     */
    const urlToBase64 = async function (blob) {
      return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    const setPreview = async (value) => {
      const blob = await fetchImage(value)
      previewUrl.value = await urlToBase64(blob)
    }

    /**
     * @param publicId
     * @param timestamp
     * @returns {*}
     */
    const generateSignature = function (publicId, timestamp) {
      const params = `public_id=${publicId}&timestamp=${timestamp}`
      return sha.default.hex(params)
    }

    /**
     * @param fileName
     * @returns {string}
     */
    const generateFileName = (fileName) => {
      const name = String(fileName).toLowerCase().replace(/ /g, '_')
      return name
    }

    const {getRootProps, getInputProps, isDragAccept, ...rest} = useDropzone({
      onDrop,
      maxFiles: 1,
      accept: 'image/*'
    });

    /**
     * @param formData
     * @returns {Promise<void>}
     */
    async function send(id,body) {
      toggleProgress()
      const url = `${apiUrl.value}/${folder}/${id}`;
      const key = apiKey;
      console.log("key",key);
      console.log("key.value",key.value);
      const response = await axios.put(url, body, {headers:{  
        'content-type': 'application/octet-stream',
        AccessKey: key
      }});
      toggleProgress()

      // toggleProgress()
      // const response = await axios.post(`${apiUrl.value}/image/upload`, formData);
      // toggleProgress()
      return url
    }

    /***
     * @param acceptFiles
     * @param rejectReasons
     * @returns {Promise<void>}
     */
    async function onDrop(acceptFiles, rejectReasons) {
      if (isDragAccept) {
        // const formData = new FormData()
        let dataUrl = await urlToBase64(acceptFiles[0])
        // formData.append('body', dataUrl)

        const fileName = generateFileName(acceptFiles[0].name)
        const timestamp = (new Date()).getTime().toString()
        const id = generateSignature(fileName, timestamp);

        const url = await send(id,dataUrl)
        emit('input', url)
      }
    }

    watchEffect(() => {
      setPreview(props.value)
    })
    onMounted(async () => {
      await setPreview(props.value);
    })

    return {
      getRootProps,
      getInputProps,
      previewUrl,
      values,
      uploadProgress,
      ...rest,
    };
  },
};
</script>

<style>
#bunny-upload-dropzone {
  width: 100%;
  padding: 20px;
  background: #f0f4f9;
  border-radius: 10px;
  position: relative;
}

#bunny-upload-dropzone .draggable-zone {
  min-height: 50vh;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

#bunny-upload-dropzone .draggable-zone.is-dragged {
  border: 5px dashed slategrey;
}

#bunny-upload-dropzone img {
  max-width: 370px;
}

#bunny-upload-dropzone .loader {
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  position: absolute;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  top:0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>