require 'bootstrap-sass'
require 'font-awesome-sass'
require 'compass/import-once/activate'

# make @import "yadda"; also find yadda.css
class CSSImporter < Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end

# configuration is in package.json
require 'json'
config = JSON.parse(File.read('./package.json'))['config']


# source dir
sass_dir = config["styleRoot"]

# output dir
build_dir = config["destRoot"]


# import dirs
add_import_path "styles"
add_import_path "bower_components"
add_import_path CSSImporter.new("node_modules")


# Set this to the root of your project when deployed:
http_path = "/"

http_stylesheets_dir = "css"
http_fonts_dir       = "fonts"
http_javascripts_dir = "js"
http_images_dir      = "img"

css_dir =         build_dir + "/css"
fonts_dir =       build_dir + "/fonts"
javascripts_dir = build_dir + "/js"
images_dir =      build_dir + "/img"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = false

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
