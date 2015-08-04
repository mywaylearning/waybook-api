<?php
function printParams($op) {
  $params = array();
  if (sizeof($op['parameters']) == 0) {
    return '';
  }
  foreach ($op['parameters'] as $param) {
    if (isset($param['type'])) {
      $type = $param['type'];
      $description = $param['description'];
      $params[] = rtrim("   * @param {" . ucfirst($type) . "} {$param['name']} {$description}");
    } elseif (isset($param['schema'])) {
      $model = $param['schema']['$ref'];
      //$type = $op['models'][$model]['properties'][$param['name']]['type'];
      $type = $model;
      $description = $op['models'][$model]['description'];
      $paramstr = rtrim("   * @param {" . $model . "} {$param['name']} {$description}");
      if (! in_array($paramstr, $params)) {
        $params[] = $paramstr;
      }
    }
  }
  return join($params, PHP_EOL) . PHP_EOL;
}

function printMethod($op, $className = 'Waybook') {
  if ($className == 'Waybook') {
    $method = $className . '.' . $op['operationId'] . ' = function(';
  } else {
    $className = ucfirst($className);
    $method = $className . '.' . $op['operationId'] . '(';
  }
  $params = array();
  foreach($op['parameters'] as $param) {
    $params[] = $param['name'];
  }
  $params[] = 'request';
  $params[] = 'callback';

  if ($className == 'Waybook') {
    return $method . join($params, ', ') . ') {' . PHP_EOL;
  } else {
    $ret = 'Waybook.app.models.';
    if (isset($op['x-loopback-model'])) {
      $ret .= $op['x-loopback-model'];
    } else {
      $ret .= ucfirst($className);
    }

    if (isset($op['x-loopback-method'])) {
      $ret .= '.' . $op['x-loopback-method'];
    } else {
      $ret .= '.' . $op['operationId'];
    }

    $ret .= '(';
    return $ret . join($params, ', ') . ');' . PHP_EOL;
  }
}

function printReturns($op) {
  $returns = array();
  if (sizeof($op['responses'] > 0)) {
    foreach ($op['responses'] as $code => $detail) {
      if ($code == 200 || $code == 201) {
        $returns[] = array(
          'arg' => 'payload',
          'root' => true,
          'type' => basename($detail['schema']['$ref'])
        );
      }
    }
  }

  $r = '';
  $s = '          '; // left space
  foreach ($returns as $arg) {

    $r .= "        {\n";
    foreach ($arg as $k => $v) {
      if ($k == 'required' || $k == 'root') {
        $boo = $v ? 'true' : 'false';
        $r .= $s . $k . ": {$boo},\n";
      } else {
        $r .= $s . $k . ": '{$v}',\n";
      }
    }
    $r = rtrim($r, ",\n") . "\n";
    $r .= "        },\n";
  }

  $r = rtrim($r, ',');
  return $r;
}

function printAccepts($op) {
  $accepts = array();

  if (sizeof($op['parameters']) == 1 && $op['parameters'][0]['in'] == 'body') {
    $p = $op['parameters'][0];
    $arg = array(
      'arg' => $p['name'],
      'type' => basename($p['schema']['$ref']),
      'required' => (bool) $p['required'],
      'zhttpsrc' => 'body'
    );
    if (isset($p['description'])) {
      $arg['description'] = $p['description'];
    }
    ksort($arg);
    $accepts[] = $arg;
  } else {
    foreach ($op['parameters'] as $param) {
      $arg = array();
      if (isset($param['type'])) {
        $arg['type'] = $param['type'];
      }
      if (isset($param['name'])) {
        $arg['arg'] = $param['name'];
      }
      if (isset($param['description'])) {
        $arg['description'] = $param['description'];
      }
      $arg['required'] = (bool) $param['required'];
      if ($param['in'] == 'formData') {
        $arg['zhttpsrc'] = 'form';
      } else {
        $arg['zhttpsrc'] = $param['in'];
      }
      ksort($arg);
      $accepts[] = $arg;
    }
  }

  $a = '';
  $s = '          '; // left space
  foreach ($accepts as $arg) {

    $a .= "        {\n";
    foreach ($arg as $k => $v) {
      if ($k == 'zhttpsrc') {
        $a .= $s . "http: { source: '{$v}' }\n";
      } elseif ($k == 'required') {
        $reqd = $v ? 'true' : 'false';
        $a .= $s . $k . ": {$reqd},\n";
      } else {
        $a .= $s . $k . ": '{$v}',\n";
      }
    }
    $a = rtrim($a, ",\n") . "\n";
    $a .= "        },\n";
  }

  return $a;
}

?>'use strict';
/**
 *
 *    Hang on there, friend.
 *
 *    If you're feeling like you need to edit this file, please don't.
 *    Instead, edit the `scripts/generate-api` script, or the
 *    `scripts/model.tpl` file.
 *
 *    If neither of those include what you want to change, it sounds
 *    like the change you want to make should be made to the spec in
 *    the common/api directory.
 *
 *    Happy hacking!
 *
 */
module.exports = function(Waybook) {
<?php
foreach ($operations as $path => $o) {
  foreach ($o as $verb => $op) {
  if ($op['x-loopback-skip']) { continue; }?>

  /**
   * <?= strtoupper($verb) . ' ' . $path . PHP_EOL ?>
   *
   * <?= rtrim($op['description']) . PHP_EOL; echo printParams($op); ?>
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {<?= join($op['returns'], '|')?>} result Result object
   * @see <?= ucfirst($op['tags'][0]) ?>.<?= $op['operationId'] . PHP_EOL ?>
   */
  <?= printMethod($op) ?>
    <?= printMethod($op, $op['tags'][0]) ?>
  };

  /**
   * Remote method hook for <?= strtoupper($verb) . ' ' . $path . PHP_EOL ?>
   *
   * @see <?= ucfirst($op['tags'][0]) ?>.<?= $op['operationId'] . PHP_EOL ?>
   */
  Waybook.remoteMethod(
    '<?= $op['operationId'] ?>',
    {
      description: '<?= $op['description'] ?>',
      isStatic: true,
      accepts: [
<?= printAccepts($op) ?>
        {
          arg: 'req',
          type: 'object',
          http: { source: 'req' }
        }
      ],
      returns: [
<?= printReturns($op) ?>
      ],
      http: { verb: '<?= $op['verb'] ?>', path: '<?= $op['path'] ?>' }
    }
  );
<?php
  }
} ?>
};
