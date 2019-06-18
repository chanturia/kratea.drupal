<?php

namespace Drupal\kratea_propertie\Plugin\Block;

use Drupal\Core\Block\BlockBase;


/**
 * Provides a 'language menu' Block.
 *
 * @Block(
 *   id = "language_menu",
 *   admin_label = @Translation("Language Menu"),
 *   category = @Translation("Kratea properti"),
 * )
 */
class languageMenuBlock extends BlockBase {
  
  /**
   * {@inheritdoc}
   */
  public function build() {
    $renderArray = [
      '#theme' => 'language_menu_block',
    ];
    $currentLanguage = \Drupal::service('language_manager')
      ->getCurrentLanguage();
    $languages = \Drupal::service('language_manager')->getLanguages();
    unset($languages[$currentLanguage->getId()]);
    $renderArray['#languages']['current'] = $currentLanguage->getId();
    foreach ($languages as $item) {
      $renderArray['#languages']['more'][] = $item->getId();
    }
    return $renderArray;
  }
}