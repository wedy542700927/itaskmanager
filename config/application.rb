require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Itaskmanager
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
   config.autoload_paths += %W(#{config.root}/lib)

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    config.active_record.default_timezone = :local  
    config.time_zone = 'Beijing'  

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = "zh-CN"
    config.action_view.sanitized_allowed_tags = ["table", "tr", "td", "strong", "em", "b", "i", "p", "code", "pre", "tt", "samp", "kbd", "var", "sub", "sup", "dfn", "cite", "big", "small", "address", "hr", "br", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "dl", "dt", "dd", "abbr", "acronym", "a", "img", "blockquote", "del", "ins"]
    config.action_view.sanitized_allowed_attributes = ["href", "src", "width", "height", "alt", "cite", "datetime", "title", "class", "name", "xml:lang", "abbr", "style"]
  end
end
