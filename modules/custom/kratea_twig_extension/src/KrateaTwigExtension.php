<?php
/**
 * Created by PhpStorm.
 * User: George Dev
 * Date: 4/2/2018
 * Time: 12:04 PM
 */

namespace Drupal\kratea_twig_extension;

use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Plugin\ContextAwarePluginInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Site\Settings;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;

class KrateaTwigExtension extends \Twig_Extension {
  
  /*Todo: Describe and decing better the function*/
  
  /**
   * {@inheritdoc}
   * This function must return the name of the extension. It must be unique.
   */
  public function getName() {
    return 'kratea_twig_extension';
  }
  
  /**
   * In this function we can declare the extension function
   */
  public function getFunctions() {
    return [
      new \Twig_SimpleFunction(
        'get_url_from_entity',
        [$this, 'getUrlFromEntity',]),
      new \Twig_SimpleFunction(
        'get_image_url_from_entity',
        [$this, 'getImageUrlFromEntity',]),
      new \Twig_SimpleFunction(
        'kratea_render_block',
        [$this, 'renderBlock',]),
      new \Twig_SimpleFunction(
        'path_language',
        [$this, 'getPathWithLanguage',]),
      new \Twig_SimpleFunction(
        'drupal_menu',
        [$this, 'drupalMenu',]),
    ];
  }
  
  /**
   * {@inheritdoc}
   */
  public function getFilters() {
    $filters = [
      new \Twig_SimpleFilter('kratea_image_style', [$this, 'imageStyle']),
    ];
    // PHP filter should be enabled in settings.php file.
    if (Settings::get('twig_tweak_enable_php_filter')) {
      $filters[] = new \Twig_SimpleFilter('php', [$this, 'phpFilter']);
    }
    return $filters;
  }
  
  
  /**
   * The php function to load a given block
   *
   * @param $Entity
   *
   * @param string $url_type
   *   "canonical" = "/node/{node}",
   *   "edit-form" = "/node/{node}/edit",
   *   "version-history" = "/node/{node}/revisions"
   *
   *
   * @return \Drupal\Core\GeneratedUrl|null|string
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function getUrlFromEntity($Entity, $url_type = 'canonical') {
    //\Drupal::service('page_cache_kill_switch')->trigger();
    if (!empty($Entity)) {
      return $Entity->toUrl($url_type)->toString();
    }
    return '';
  }
  
  /**
   * Returns the render array for a single entity field.
   *
   * @param string $field_name
   *   The field name.
   * @param $entity
   *
   * @param $image_style
   *
   * @return array
   *   A render array for the field or NULL if the value does not exist.
   */
  public function getImageUrlFromEntity($field_name, $entity, $image_style = NULL) {
    //\Drupal::service('page_cache_kill_switch')->trigger();
    $image_style = $image_style ?: NULL;
    $imageUrlArray = [];
    if (isset($entity) &&
      ($entity instanceof EntityInterface) &&
      $entity->hasField($field_name) &&
      !$entity->get($field_name)->isEmpty()) {
      $images = $entity->get($field_name)->getValue();
      foreach ($images as $image) {
        if ($image_style) {
          $imageUrlArray[] = [
            'url' => ImageStyle::load($image_style)
              ->buildUrl(File::load($image['target_id'])->uri->value),
            'title' => $image['title'],
          ];
        }
        else {
          $imageUrlArray[] = [
            'url' => File::load($image['target_id'])->url(),
            'title' => $image['title'],
          ];
        }
      }
    }
    return $imageUrlArray;
  }
  
  
  /**
   * Builds the render array for a block.
   *
   * @param mixed $id
   *   The string of block plugin to render.
   * @param array $configuration
   *   (Optional) Pass on any configuration to the plugin block.
   * @param bool $wrapper
   *   (Optional) Whether or not use block template for rendering.
   *
   * @return null|array
   *   A render array for the block or NULL if the block cannot be rendered.
   */
  public
  function renderBlock($id, array $configuration = [], $wrapper = TRUE) {
    //   \Drupal::service('page_cache_kill_switch')->trigger();
    $configuration += ['label_display' => BlockPluginInterface::BLOCK_LABEL_VISIBLE];
    
    /** @var \Drupal\Core\Block\BlockPluginInterface $block_plugin */
    $block_plugin = \Drupal::service('plugin.manager.block')
      ->createInstance($id, $configuration);
    
    // Inject runtime contexts.
    if ($block_plugin instanceof ContextAwarePluginInterface) {
      $contexts = \Drupal::service('context.repository')
        ->getRuntimeContexts($block_plugin->getContextMapping());
      \Drupal::service('context.handler')
        ->applyContextMapping($block_plugin, $contexts);
    }
    
    if (!$block_plugin->access(\Drupal::currentUser())) {
      return NULL;
    }
    
    $content = $block_plugin->build();
    
    if ($content && !Element::isEmpty($content)) {
      if ($wrapper) {
        $build = [
          '#theme' => 'block',
          '#attributes' => [],
          '#contextual_links' => [],
          '#configuration' => $block_plugin->getConfiguration(),
          '#plugin_id' => $block_plugin->getPluginId(),
          '#base_plugin_id' => $block_plugin->getBaseId(),
          '#derivative_plugin_id' => $block_plugin->getDerivativeId(),
          'content' => $content,
        ];
      }
      else {
        $build = $content;
      }
    }
    else {
      // Preserve cache metadata of empty blocks.
      $build = [
        '#markup' => '',
        '#cache' => $content['#cache'],
      ];
    }
    
    if (!empty($content)) {
      CacheableMetadata::createFromRenderArray($build)
        ->merge(CacheableMetadata::createFromRenderArray($content))
        ->applyTo($build);
    }
    
    return $build;//NULL;
  }
  
  
  /**
   * Returns the URL of this image derivative for an original image path or URI.
   *
   * @param string $path
   *   The path or URI to the original image.
   * @param string $style
   *   The image style.
   *
   * @return string
   *   The absolute URL where a style image can be downloaded, suitable for use
   *   in an <img> tag. Requesting the URL will cause the image to be created.
   */
  public
  function imageStyle($path, $style): string {
    /** @var \Drupal\Image\ImageStyleInterface $image_style */
    if ($image_style = ImageStyle::load($style)) {
      return file_url_transform_relative($image_style->buildUrl($path));
    }
    return NULL;
  }
  
  /**
   * Generates a URL path given a route name and parameters.
   *
   * @param $name
   *   The name of the route.
   * @param array $parameters
   *   An associative array of route parameters names and values.
   * @param array $options
   *   (optional) An associative array of additional options. The 'absolute'
   *   option is forced to be FALSE.
   *
   * @return string
   *   The generated URL path (relative URL) for the given route.
   *
   * @see \Drupal\Core\Routing\UrlGeneratorInterface::generateFromRoute()
   */
  public
  function getPathWithLanguage($name, $parameters = [], $options = []) {
    $urlGenerator = \Drupal::service('url_generator');
    $options['absolute'] = FALSE;
    
    if (array_key_exists('language', $options)) {
      $options['language'] = \Drupal::languageManager()
        ->getLanguage($options['language']);
    }
    return $urlGenerator->generateFromRoute($name, $parameters, $options);
  }
  
  /**
   * Returns the render array for Drupal menu.
   *
   * @param string $menu_name
   *   The name of the menu.
   * @param int $level
   *   (optional) Initial menu level.
   * @param int $depth
   *   (optional) Maximum number of menu levels to display.
   * @param bool $expand
   *   (optional) Expand all menu links.
   *
   * @return array
   *   A render array for the menu.
   */
  public function drupalMenu($menu_name, $level = 1, $depth = 0, $expand = FALSE) {
    /** @var \Drupal\Core\Menu\MenuLinkTreeInterface $menu_tree */
    $menu_tree = \Drupal::service('menu.link_tree');
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    
    // Adjust the menu tree parameters based on the block's configuration.
    $parameters->setMinDepth($level);
    // When the depth is configured to zero, there is no depth limit. When depth
    // is non-zero, it indicates the number of levels that must be displayed.
    // Hence this is a relative depth that we must convert to an actual
    // (absolute) depth, that may never exceed the maximum depth.
    if ($depth > 0) {
      $parameters->setMaxDepth(min($level + $depth - 1, $menu_tree->maxDepth()));
    }
    
    // If expandedParents is empty, the whole menu tree is built.
    if ($expand) {
      $parameters->expandedParents = [];
    }
    
    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);
    return $menu_tree->build($tree);
  }
}

