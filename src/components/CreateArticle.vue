<template>
  <div class="mt-5 mx-5">
    <v-flex xs12>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="article.title"
        type="text"
        label="Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="article.content"
        type="text"
        label="Content"
        required
      ></v-text-field>
      <v-subheader class="title">Добавить изображения:</v-subheader>
      <v-flex xs12>
        <v-btn class="warning" @click="triggerUpload">
          Upload
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
        <input
          ref="files"
          type="file"
          multiple
          style="display: none;"
          accept="image/*"
          @change="onFileChange"
        >
      </v-flex>
      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12
                  sm6
                  md4
                  v-for="(image, key) in article.images" :key="key"
          >
            <v-card>
              <img :src="image.data" height="200" width="100%" style="object-fit: contain">
              <v-card-title primary-title>
                <div>
                  <span class="headline mb-0">{{image.name}}</span>
                </div>
              </v-card-title>
              <v-btn
                color="pink"
                dark
                small
                bottom
                left
                fab
                @click="removeFile(key)"
              >
                <v-icon>remove</v-icon>
              </v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-btn
        :disabled="!valid"
        @click="submit"
      >
        submit
      </v-btn>
    </v-form>
    </v-flex>
  </div>
</template>

<script>
  import api from '../plugins/api'

  export default {
    data () {
      return {
        valid: true,
        article: {
          title: '',
          content: '',
          images: []
        }
      }
    },
    methods: {
      async submit () {
        if (this.$refs.form.validate()) {
          await api.post('/articles', this.article)
        }
      },
      triggerUpload () {
        this.$refs.files.click()
      },
      onFileChange () {
        const uploadedFiles = this.$refs.files.files
        for (let i = 0; i < uploadedFiles.length; i++) {
          const reader = new FileReader()
          reader.onload = () => {
            this.article.images.push({
              name: uploadedFiles[i].name,
              data: reader.result
            })
          }
          reader.readAsDataURL(uploadedFiles[i])
        }
      },
      removeFile (key) {
        this.article.images.splice(key, 1)
      }
    }
  }
</script>
