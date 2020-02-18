module.exports = {

    template: '<textarea class="testingnotesummer" :name="name"></textarea>',

    props: {
        model: {
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        height: {
            type: String,
            default: '300'
		},

		toolbar:{
			type: Array,
			default: () => {
				return  [
							['style', ['style']],
							['font', ['bold', 'italic', 'underline', 'clear']],
							// ['fontname', ['fontname']],
							['color', ['color']],
							['para', ['ul', 'ol', 'paragraph']],
							['table', ['table']],
							['insert', ['link', 'picture']],
							['view', ['fullscreen', 'codeview']],
							['help', ['help']]
						]
			}
		},

		popOver: {
			type: Object,
			default: () => {
				return {
					image: [
						['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
						['float', ['floatLeft', 'floatRight', 'floatNone']],
						['remove', ['removeMedia']]
					],
					link: [
						['link', ['linkDialogShow', 'unlink']]
					],
					air: [
						['color', ['color']],
						['font', ['bold', 'underline', 'clear']],
						['para', ['ul', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture']]
					]
				}
			}
		}
    },

    mounted() {

        let config = {
            height: this.height,
            toolbar: this.toolbar,
            popover: this.popOver
        };

        let vm = this;

        config.callbacks = {

            onInit: function () {
                $(vm.$el).summernote("code", vm.model);
            },

            onChange: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            },

            onBlur: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            }
        };

        $(this.$el).summernote(config);

    },

}
